import type { CaseResult, RustGraderDef } from "./types";

// Rust の採点系。ブラウザ（Rust Playground）と Node（ローカル rustc）で共有する純粋部分。
//
// 流れ:
//   1. buildRustProgram: 学習者コード + 採点用 main を 1 本のプログラムにする
//   2. 実行器（executor）でコンパイル・実行し { success, stdout, stderr } を得る
//   3. parseRustRun: 出力からケースごとの合否を組み立てる
//
// 実行器は環境ごとに差し替える（ブラウザ = fetch で Playground、Node = child_process で rustc）。

export type RustRun = {
  /** コンパイルが通り、プロセスが正常終了したか */
  success: boolean;
  /** コンパイルに失敗したか（success=false の内訳） */
  compileError: boolean;
  stdout: string;
  stderr: string;
};

export type RustExecutor = (program: string) => Promise<RustRun>;

const CASE_MARK = "@@ZVCASE";
const PANIC_MARK = "@@PANIC@@";

/** 学習者コードに採点用の main を付け足したプログラムを作る。 */
export function buildRustProgram(grader: RustGraderDef, learnerCode: string): string {
  if (grader.mode === "stdout") return learnerCode;

  const calls = grader.cases
    .map(
      (
        c,
        i,
      ) => `    match std::panic::catch_unwind(std::panic::AssertUnwindSafe(|| format!("{:?}", {
        ${c.expr}
    }))) {
        Ok(s) => println!("${CASE_MARK}${i}@@{}", s.replace('\\n', "\u{2424}")),
        Err(e) => println!("${CASE_MARK}${i}@@${PANIC_MARK}{}", zv_panic_message(&e)),
    }`,
    )
    .join("\n");

  return `${learnerCode}

// ---- ここから下は採点用に自動で付け足されるコード ----
#[allow(dead_code)]
fn zv_panic_message(e: &Box<dyn std::any::Any + Send>) -> String {
    if let Some(s) = e.downcast_ref::<&str>() {
        s.to_string()
    } else if let Some(s) = e.downcast_ref::<String>() {
        s.clone()
    } else {
        String::from("panic")
    }
}

#[allow(unreachable_code, unused_braces, clippy::all)]
fn main() {
    // panic のメッセージは採点結果に載せるので、標準エラーへの二重表示は止める
    std::panic::set_hook(Box::new(|_| {}));
${calls}
}
`;
}

const normalizeStdout = (s: string): string =>
  s
    .replace(/\r\n/g, "\n")
    .split("\n")
    .map((l) => l.replace(/\s+$/, ""))
    .join("\n")
    .replace(/\n+$/, "");

/** rustc のエラー出力から、学習者に見せる最初のエラー（コード付き）を抜き出す。 */
export function firstRustError(stderr: string): { code?: string; text: string } {
  const lines = stderr.split("\n");
  const start = lines.findIndex((l) => /^error(\[E\d{4}\])?:/.test(l));
  if (start === -1) {
    const fallback = lines.find((l) => l.trim() && !/^\s*(Compiling|Finished|Running)/.test(l));
    return { text: (fallback ?? stderr).trim() };
  }
  // 次の空行（＝エラーブロックの終わり）まで、最大 12 行を表示用に切り出す
  const block: string[] = [];
  for (let i = start; i < lines.length && block.length < 12; i++) {
    if (i > start && lines[i].trim() === "") break;
    block.push(lines[i]);
  }
  const code = /^error\[(E\d{4})\]/.exec(lines[start])?.[1];
  return { code, text: block.join("\n") };
}

// よく出るコンパイルエラーの対訳。エラーコードごとに「何が起きていて、どう直すか」を短く。
const RUST_ERROR_HINTS: Record<string, string> = {
  E0382:
    "所有権が移動（move）した後の値を使っています。`.clone()` で複製するか、`&` で借用して渡しましょう。",
  E0499: "同じ値を `&mut` で同時に 2 回借用しています。可変借用は同時に 1 つだけです。",
  E0502:
    "不変借用（`&`）している間に可変借用（`&mut`）しようとしています。借用の使用範囲を分けましょう。",
  E0505:
    "借用されている間にその値を move しようとしています。借用を使い終えてから move しましょう。",
  E0506: "借用されている間にその値へ代入しようとしています。",
  E0507:
    "借用（参照）の中から値を move しようとしています。`.clone()` するか参照のまま使いましょう。",
  E0308: "型が合っていません。期待されている型（expected）と実際の型（found）を見比べましょう。",
  E0425: "その名前の変数・関数が見つかりません。タイプミスか、定義し忘れかもしれません。",
  E0412: "その名前の型が見つかりません。タイプミスか、`use` し忘れかもしれません。",
  E0433: "パス（`::` でつないだ名前）が解決できません。`use` やモジュール名を確認しましょう。",
  E0384: "不変の変数に 2 回代入しています。変更したいなら `let mut` で宣言しましょう。",
  E0596:
    "`mut` でない変数を可変借用しようとしています。`let mut` にするか、引数を `&mut` にしましょう。",
  E0594: "不変の値に代入しようとしています。`mut` を付ける必要があります。",
  E0106: "参照を返す・持つときのライフタイム指定が足りません。`<'a>` を付けてみましょう。",
  E0597:
    "借用している値のほうが先に破棄されてしまいます（長生きしない）。値のスコープを広げましょう。",
  E0515:
    "関数の中で作った値への参照を返そうとしています。参照ではなく値そのもの（所有権）を返しましょう。",
  E0716:
    "一時的な値がすぐ破棄されるのに、その参照を使い続けています。いったん `let` で変数に入れましょう。",
  E0277:
    "必要なトレイトが実装されていません（例: 表示に `Debug` / `Display`、比較に `PartialOrd`）。`#[derive(...)]` やトレイト境界を確認しましょう。",
  E0599:
    "その型にそのメソッドはありません。メソッド名のタイプミスか、必要なトレイトの実装・`use` 漏れかもしれません。",
  E0061: "関数に渡している引数の数が定義と違います。",
  E0063: "構造体を作るときにフィールドが足りません。",
  E0560: "構造体にそんな名前のフィールドはありません。",
  E0609: "その型にそんな名前のフィールドはありません。",
  E0004: "`match` が全パターンを網羅していません。足りない腕を足すか、`_ =>` を加えましょう。",
  E0369: "その型同士にはその演算子が使えません（演算子のトレイトが未実装）。",
  E0368: "その型にはその複合代入演算子（`+=` など）が使えません。",
  E0282: "型を推論できません。`let x: 型 = ...` や `::<型>` で型を教えてあげましょう。",
  E0283: "型を 1 つに決められません。`::<型>` や型注釈で指定しましょう。",
  E0603: "非公開（private）の要素にアクセスしています。`pub` を付ける必要があります。",
  E0614: "参照外し（`*`）できない値に `*` を付けています。",
  E0620: "その型変換は `as` ではできません。",
  E0023: "パターンのフィールド数が合っていません。",
  E0026: "構造体パターンにそんな名前のフィールドはありません。",
  E0027: "構造体パターンでフィールドが足りません。`..` で残りを無視できます。",
  E0040: "`drop` メソッドは直接呼べません。`drop(x)` 関数を使いましょう。",
  E0046: "トレイトに必要なメソッドが実装されていません。",
  E0053: "トレイトのメソッドのシグネチャ（引数・戻り値の型）が定義と違います。",
  E0117: "外部の型に外部のトレイトは実装できません（孤児ルール）。新しい型で包みましょう。",
  E0201: "同じ名前のメソッドを 2 回定義しています。",
  E0252: "同じ名前を 2 回 `use` しています。",
  E0261: "宣言していないライフタイムを使っています。`<'a>` を宣言しましょう。",
  E0373:
    "クロージャが借用した値より長生きする可能性があります。`move` を付けて所有権ごと渡しましょう。",
  E0381: "初期化していない変数を使っています。",
  E0423: "その名前は値として使えません（型や構造体名をそのまま使っている可能性）。",
  E0428: "同じ名前を 2 回定義しています（`fn main` を書くと採点用の main と重複します）。",
  E0432: "`use` したものが見つかりません。パスを確認しましょう。",
  E0434: "関数の中の `fn` からは外側のローカル変数を使えません。クロージャを使いましょう。",
  E0435: "定数の位置に変数は使えません。",
  E0503: "可変借用されている間に値を使っています。",
  E0520: "特殊化の衝突です。",
  E0532: "パターンに使えないものを書いています。",
  E0583:
    "モジュールのファイルが見つかりません。このサイトでは `mod name { ... }` とインラインで書きましょう。",
  E0600: "その型には単項演算子（`-` や `!`）が使えません。",
  E0618: "関数でないものを呼び出しています。",
  E0689: "数値の型が決まらずメソッドを呼べません。`2.0_f64` のように型を付けましょう。",
  E0747: "ジェネリクスの引数の順番が違います（ライフタイム → 型 → 定数）。",
};

// panic メッセージの対訳（部分一致）。
const PANIC_HINTS: { re: RegExp; hint: string }[] = [
  {
    re: /index out of bounds/,
    hint: "配列・Vec の範囲外を添字で読もうとしました。`.get(i)` なら Option で安全に取れます。",
  },
  {
    re: /called `Option::unwrap\(\)` on a `None` value/,
    hint: "None に対して `.unwrap()` しました。`match` や `if let`、`unwrap_or` で None の場合を扱いましょう。",
  },
  {
    re: /called `Result::unwrap\(\)` on an `Err` value/,
    hint: "Err に対して `.unwrap()` しました。`match` や `?` でエラーを扱いましょう。",
  },
  {
    re: /attempt to (add|subtract|multiply|negate) with overflow/,
    hint: "整数のオーバーフローです（デバッグビルドでは panic）。型を大きくするか `checked_*` / `wrapping_*` / `saturating_*` を使いましょう。",
  },
  {
    re: /attempt to divide by zero|attempt to calculate the remainder with a divisor of zero/,
    hint: "0 で割りました。割る前に 0 かどうか確かめましょう。",
  },
  {
    re: /already borrowed|already mutably borrowed/,
    hint: "RefCell の借用ルール違反を実行時に検出しました（borrow と borrow_mut が重なっています）。",
  },
  {
    re: /not yet implemented|not implemented/,
    hint: "`todo!()` / `unimplemented!()` がまだ残っています。中身を書きましょう。",
  },
  {
    re: /byte index .* is not a char boundary/,
    hint: "文字列を文字の途中（UTF-8 のバイト境界でない位置）で切ろうとしました。`.chars()` を使いましょう。",
  },
];

export function explainRustError(code: string | undefined): string | undefined {
  return code ? RUST_ERROR_HINTS[code] : undefined;
}

export function explainPanic(message: string): string | undefined {
  return PANIC_HINTS.find((p) => p.re.test(message))?.hint;
}

function labelOf(c: { label?: string }, i: number): string {
  return c.label ?? `ケース${i + 1}`;
}

/** 実行結果からケースごとの合否を作る。 */
export function parseRustRun(grader: RustGraderDef, run: RustRun): CaseResult[] {
  // コンパイルエラー: 全ケース同じ理由で不合格。エラー本文＋対訳を detail に載せる。
  if (run.compileError) {
    const { code, text } = firstRustError(run.stderr);
    const hint = explainRustError(code);
    const detail = `コンパイルエラー${code ? `（${code}）` : ""}${hint ? `: ${hint}` : ""}\n${text}`;
    // 全文は最初のケースにだけ載せる（同じエラーを何度も並べない）
    return grader.cases.map((c, i) => ({
      label: labelOf(c, i),
      passed: false,
      detail: i === 0 ? detail : "コンパイルエラーのため実行できませんでした（上のエラーを参照）",
    }));
  }

  if (grader.mode === "stdout") {
    const panicLine = /panicked at[^\n]*\n([^\n]*)/.exec(run.stderr);
    return grader.cases.map((c, i) => {
      const label = labelOf(c, i);
      if (!run.success && panicLine) {
        const msg = panicLine[1].trim();
        const hint = explainPanic(msg);
        return { label, passed: false, detail: `実行中に panic: ${msg}${hint ? `\n${hint}` : ""}` };
      }
      const ok = normalizeStdout(run.stdout) === normalizeStdout(c.expected);
      return {
        label,
        passed: ok,
        detail: ok
          ? undefined
          : `期待 ${JSON.stringify(normalizeStdout(c.expected))} / 実際 ${JSON.stringify(normalizeStdout(run.stdout))}`,
        output: run.stdout,
      };
    });
  }

  // harness: マーカー行を拾ってケース番号ごとに結果を対応付ける
  const outputs = new Map<number, string>();
  for (const line of run.stdout.split("\n")) {
    const m = new RegExp(`^${CASE_MARK}(\\d+)@@(.*)$`).exec(line);
    if (m) outputs.set(Number(m[1]), m[2]);
  }
  return grader.cases.map((c, i) => {
    const label = labelOf(c, i);
    const out = outputs.get(i);
    if (out === undefined) {
      return {
        label,
        passed: false,
        detail: run.success
          ? "結果が出力されませんでした"
          : `途中で止まりました${run.stderr.trim() ? `: ${run.stderr.trim().split("\n").slice(-1)[0]}` : ""}`,
      };
    }
    if (out.startsWith(PANIC_MARK)) {
      const msg = out.slice(PANIC_MARK.length);
      const hint = explainPanic(msg);
      return { label, passed: false, detail: `panic: ${msg}${hint ? `\n${hint}` : ""}` };
    }
    // 複数行の出力（{:#?} 等）は 1 行に収めるため改行を ␤ に置き換えてある。元に戻す。
    const actual = out.replace(/\u2424/g, "\n");
    const ok = actual === c.expected;
    return {
      label,
      passed: ok,
      detail: ok ? undefined : `期待 ${c.expected} / 実際 ${actual}\n（式: ${c.expr.trim()}）`,
    };
  });
}

/** 実行器を使ってケースを採点する（環境非依存）。 */
export async function gradeRust(
  grader: RustGraderDef,
  learnerCode: string,
  exec: RustExecutor,
): Promise<CaseResult[]> {
  let run: RustRun;
  try {
    run = await exec(buildRustProgram(grader, learnerCode));
  } catch (e) {
    return grader.cases.map((c, i) => ({
      label: labelOf(c, i),
      passed: false,
      detail: (e as Error).message,
    }));
  }
  return parseRustRun(grader, run);
}
