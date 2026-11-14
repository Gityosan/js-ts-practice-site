// Rust 用の解読（decoding）トークナイザと説明。
// JS / bash 版（tokenize.ts）と同じ Token 形式を返すので、DecodePane・matchBrackets をそのまま使える。
//
// Rust 特有の扱い:
// - `println!` のような「名前 + !」はマクロ呼び出しとして 1 トークンにする
// - `'a` はライフタイム（型の一部）、`'x'` は文字リテラル
// - `#[derive(Debug)]` のような属性は 1 トークン（コメント扱いの色）にまとめる
// - `->` `=>` `::` `..` `..=` などの 2〜3 文字記号
// - 括弧の意味は「直前の予約語」で決まる（fn の ( ) は引数、if / match / struct の { } は…）

import type { Token, TokenType, TokenExplain } from "./tokenize";

const RUST_KEYWORDS = new Set([
  "as",
  "async",
  "await",
  "break",
  "const",
  "continue",
  "crate",
  "dyn",
  "else",
  "enum",
  "extern",
  "false",
  "fn",
  "for",
  "if",
  "impl",
  "in",
  "let",
  "loop",
  "match",
  "mod",
  "move",
  "mut",
  "pub",
  "ref",
  "return",
  "self",
  "Self",
  "static",
  "struct",
  "super",
  "trait",
  "true",
  "type",
  "unsafe",
  "use",
  "where",
  "while",
]);

// 型（およびよく使う標準の型・バリアント）。「名前」ではなく型として色分けする。
const RUST_TYPES = new Set([
  "i8",
  "i16",
  "i32",
  "i64",
  "i128",
  "isize",
  "u8",
  "u16",
  "u32",
  "u64",
  "u128",
  "usize",
  "f32",
  "f64",
  "bool",
  "char",
  "str",
  "String",
  "Vec",
  "Option",
  "Result",
  "Box",
  "Rc",
  "RefCell",
  "HashMap",
  "HashSet",
]);

// 型ではないが標準で用意されている enum のバリアント（値を作る）
const RUST_VARIANTS = new Set(["Some", "None", "Ok", "Err"]);

const OPS3 = new Set(["..=", "<<=", ">>="]);
const OPS2 = new Set([
  "->",
  "=>",
  "::",
  "..",
  "==",
  "!=",
  "<=",
  ">=",
  "&&",
  "||",
  "+=",
  "-=",
  "*=",
  "/=",
  "%=",
  "<<",
  ">>",
]);

const isIdStart = (c: string) => /[A-Za-z_]/.test(c);
const isIdPart = (c: string) => /[A-Za-z0-9_]/.test(c);

export function tokenizeRust(src: string): Token[] {
  const tokens: Token[] = [];
  const n = src.length;
  let i = 0;
  const push = (type: TokenType, value: string, start: number) => {
    tokens.push({ type, value, start, index: tokens.length });
  };

  while (i < n) {
    const c = src[i];

    if (/\s/.test(c)) {
      let j = i + 1;
      while (j < n && /\s/.test(src[j])) j++;
      push("whitespace", src.slice(i, j), i);
      i = j;
      continue;
    }

    // コメント
    if (c === "/" && src[i + 1] === "/") {
      let j = i + 2;
      while (j < n && src[j] !== "\n") j++;
      push("comment", src.slice(i, j), i);
      i = j;
      continue;
    }
    if (c === "/" && src[i + 1] === "*") {
      let j = i + 2;
      while (j < n && !(src[j] === "*" && src[j + 1] === "/")) j++;
      j = Math.min(n, j + 2);
      push("comment", src.slice(i, j), i);
      i = j;
      continue;
    }

    // 属性 #[...] / #![...]
    if (c === "#" && (src[i + 1] === "[" || (src[i + 1] === "!" && src[i + 2] === "["))) {
      let j = src.indexOf("[", i) + 1;
      let depth = 1;
      while (j < n && depth > 0) {
        if (src[j] === "[") depth++;
        else if (src[j] === "]") depth--;
        j++;
      }
      push("comment", src.slice(i, j), i);
      i = j;
      continue;
    }

    // 文字列
    if (c === '"') {
      let j = i + 1;
      while (j < n) {
        if (src[j] === "\\") {
          j += 2;
          continue;
        }
        if (src[j] === '"') {
          j++;
          break;
        }
        j++;
      }
      push("string", src.slice(i, j), i);
      i = j;
      continue;
    }

    // 文字リテラル 'x' / '\n' と、ライフタイム 'a
    if (c === "'") {
      if (src[i + 1] === "\\") {
        let j = i + 2;
        while (j < n && src[j] !== "'") j++;
        push("string", src.slice(i, j + 1), i);
        i = j + 1;
        continue;
      }
      // 1 文字（サロゲートペアも考慮）の後ろに ' があれば文字リテラル
      const cp = src.codePointAt(i + 1);
      const len = cp !== undefined && cp > 0xffff ? 2 : 1;
      if (src[i + 1 + len] === "'") {
        push("string", src.slice(i, i + 2 + len), i);
        i += 2 + len;
        continue;
      }
      let j = i + 1;
      while (j < n && isIdPart(src[j])) j++;
      push("type", src.slice(i, j), i); // ライフタイムは型の一部
      i = j;
      continue;
    }

    // 数値（1_000, 0xff, 3.14, 10u8, 2.5f64）。`1..10` の `..` は数値に含めない
    if (/[0-9]/.test(c)) {
      let j = i + 1;
      while (j < n) {
        if (/[0-9A-Za-z_]/.test(src[j])) j++;
        else if (src[j] === "." && /[0-9]/.test(src[j + 1] ?? "")) j++;
        else break;
      }
      push("number", src.slice(i, j), i);
      i = j;
      continue;
    }

    if (isIdStart(c)) {
      let j = i + 1;
      while (j < n && isIdPart(src[j])) j++;
      const word = src.slice(i, j);
      // マクロ呼び出し: name!( / name![ / name!{
      if (src[j] === "!" && /[([{]/.test(src[j + 1] ?? "")) {
        push("identifier", `${word}!`, i);
        i = j + 1;
        continue;
      }
      const type: TokenType = RUST_KEYWORDS.has(word)
        ? "keyword"
        : RUST_TYPES.has(word)
          ? "type"
          : "identifier";
      push(type, word, i);
      i = j;
      continue;
    }

    if ("()[]{}".includes(c)) {
      push("bracket", c, i);
      i++;
      continue;
    }

    const three = src.slice(i, i + 3);
    if (OPS3.has(three)) {
      push("operator", three, i);
      i += 3;
      continue;
    }
    const two = src.slice(i, i + 2);
    if (OPS2.has(two)) {
      // => は match の腕の「左（パターン）→ 右（処理）」を作る構造の記号
      push(two === "=>" || two === "->" ? "keyword" : "operator", two, i);
      i += 2;
      continue;
    }

    if (",;:".includes(c)) {
      push("punct", c, i);
      i++;
      continue;
    }
    if ("+-*/%=<>!&|?.^~@".includes(c)) {
      push("operator", c, i);
      i++;
      continue;
    }

    push("punct", c, i);
    i++;
  }
  return tokens;
}

// ---------------------------------------------------------------------------
// 説明
// ---------------------------------------------------------------------------

const KEYWORD_DESC: Record<string, string> = {
  fn: "関数を定義する予約語。`fn 名前(引数) -> 戻り値の型 { 本体 }` の形。",
  let: "変数を作る予約語。Rust の変数は**デフォルトで変更できない（不変）**。",
  mut: "「変更できる（mutable）」の印。`let mut x` で変更可能な変数、`&mut x` で変更可能な借用。",
  const: "定数を定義する予約語。型注釈が必須で、コンパイル時に値が決まる。",
  static: "プログラム全体で 1 つだけ存在する値（静的変数）を定義する予約語。",
  if: "条件分岐の予約語。Rust の if は条件を `( )` で囲まない。if 自体が値を返す「式」でもある。",
  else: "if の条件が偽のときの処理。",
  match:
    "値をパターンと照らし合わせて分岐する予約語。`{ }` の中に `パターン => 処理` の腕を並べる。全パターンを網羅しないとエラー。",
  loop: "無限ループの予約語。`break` で抜ける。`break 値` でループから値を返せる。",
  while: "条件が真の間くり返す予約語。",
  for: "繰り返しの予約語。`for x in 並び { }` で並びの要素を 1 つずつ取り出す。",
  in: "`for x in 並び` で、何を繰り返すかを示す。",
  break: "ループを抜ける予約語。",
  continue: "ループの次の周回へ進む予約語。",
  return: "関数から値を返して抜ける予約語。最後の式なら `return` を書かずに値を返せる。",
  struct: "構造体（名前付きのフィールドをまとめた型）を定義する予約語。",
  enum: "列挙型（いくつかの候補＝バリアントのどれか 1 つ）を定義する予約語。",
  impl: "型にメソッドを実装する予約語。`impl 型 { }` や `impl トレイト for 型 { }`。",
  trait: "トレイト（型が持つべき振る舞いの約束）を定義する予約語。",
  pub: "公開（public）の印。付けないとモジュールの外から使えない。",
  use: "別の場所の名前を取り込む予約語。`use std::collections::HashMap;`",
  mod: "モジュール（名前の入れ物）を定義する予約語。",
  crate: "今のクレート（パッケージ）の一番上を指すパス。",
  self: "メソッドの中で「自分自身（このインスタンス）」を指す。`&self` は自分を借りる。",
  Self: "impl の中で「今実装している型そのもの」を指す。",
  super: "1 つ上のモジュールを指すパス。",
  as: "型を変換する予約語（`x as f64`）、または `use ... as 別名`。",
  where: "トレイト境界をまとめて後ろに書く予約語。",
  ref: "パターンの中で、値を move せずに参照として束縛する予約語。",
  move: "クロージャに、使う変数の所有権を移す（借用ではなく）印。スレッドに渡すときによく使う。",
  dyn: "トレイトオブジェクト（実行時に中身の型が決まる）の印。`Box<dyn Trait>`。",
  unsafe: "コンパイラが安全を保証できない操作をする範囲の印。",
  async: "非同期関数・ブロックを作る予約語。呼ぶと Future が返る。",
  await: "Future の完了を待つ（`.await` の形で使う）。",
  type: "型に別名を付ける予約語（`type Km = f64;`）。",
  extern: "外部（C 言語など）の関数を使う宣言。",
  true: "真偽値の「真」。",
  false: "真偽値の「偽」。",
  "=>": "match の腕で「左のパターンに一致したら、右の処理」をつなぐ矢印。",
  "->": "関数の戻り値の型を示す矢印。`-> i32` なら i32 を返す。",
};

function prevMeaningful(tokens: Token[], idx: number): Token | null {
  for (let i = idx - 1; i >= 0; i--) {
    const t = tokens[i];
    if (t.type !== "whitespace" && t.type !== "comment") return t;
  }
  return null;
}

function nextMeaningful(tokens: Token[], idx: number): Token | null {
  for (let i = idx + 1; i < tokens.length; i++) {
    const t = tokens[i];
    if (t.type !== "whitespace" && t.type !== "comment") return t;
  }
  return null;
}

/** 閉じ括弧 closeIdx に対応する開き括弧を後ろ向きに探す */
function matchBackward(tokens: Token[], closeIdx: number): number {
  const close = tokens[closeIdx].value;
  const open = close === ")" ? "(" : close === "]" ? "[" : "{";
  let depth = 0;
  for (let i = closeIdx; i >= 0; i--) {
    const t = tokens[i];
    if (t.type !== "bracket") continue;
    if (t.value === close) depth++;
    else if (t.value === open) {
      depth--;
      if (depth === 0) return i;
    }
  }
  return -1;
}

/** 開き括弧 openIdx に対応する閉じ括弧を前向きに探す */
function matchForward(tokens: Token[], openIdx: number): number {
  const open = tokens[openIdx].value;
  const close = open === "(" ? ")" : open === "[" ? "]" : "}";
  let depth = 0;
  for (let i = openIdx; i < tokens.length; i++) {
    const t = tokens[i];
    if (t.type !== "bracket") continue;
    if (t.value === open) depth++;
    else if (t.value === close) {
      depth--;
      if (depth === 0) return i;
    }
  }
  return -1;
}

/**
 * `{` の直前から文（ステートメント）の先頭へさかのぼり、意味を決める予約語を探す。
 * `( ) [ ] { }` の中身は飛ばし、`; { }` に当たったら止まる。
 */
function leadingKeyword(
  tokens: Token[],
  braceIdx: number,
): { kw: string | null; hasAssign: boolean } {
  let hasAssign = false;
  let kw: string | null = null;
  for (let i = braceIdx - 1; i >= 0; i--) {
    const t = tokens[i];
    if (t.type === "whitespace" || t.type === "comment") continue;
    if (t.type === "bracket") {
      if (t.value === ")" || t.value === "]") {
        const o = matchBackward(tokens, i);
        if (o < 0) break;
        i = o;
        continue;
      }
      break; // ( [ { } に当たったら文の先頭
    }
    if (t.value === ";") break;
    if (t.value === "=") hasAssign = true;
    if (t.value === "=>") return { kw: "=>", hasAssign };
    if (t.type === "keyword") kw = t.value; // さかのぼるほど先頭に近い予約語で上書き
  }
  return { kw, hasAssign };
}

function describeOpenBrace(tokens: Token[], idx: number): string {
  const prev = prevMeaningful(tokens, idx);
  const pv = prev?.value ?? "";
  if (pv === "else") return "この { } は else の処理（条件が偽のときのブロック）。";
  if (pv === "=>") return "この { } は match の腕の処理（複数の文をまとめたブロック）。";
  if (pv === "loop") return "この { } は loop で無限にくり返す本体。";
  if (pv === "unsafe")
    return "この { } は unsafe ブロック。中ではコンパイラの安全チェックの一部が外れる。";
  if (pv === "move" || pv === "|") return "この { } はクロージャの本体。";
  if (prev?.type === "identifier" && /^[a-z_]+!$/.test(pv))
    return "この { } はマクロの中身（マクロによって意味が変わる）。";

  const { kw, hasAssign } = leadingKeyword(tokens, idx);
  switch (kw) {
    case "fn":
      return "この { } は関数の本体。直前が `fn 名前(引数) -> 型` だから。最後の式（; なし）が戻り値になる。";
    case "struct":
      return "この { } は構造体の定義本体。`フィールド名: 型,` を並べる。";
    case "enum":
      return "この { } は enum の定義本体。候補（バリアント）を `,` 区切りで並べる。";
    case "impl":
      return "この { } は impl ブロック。中に、この型のメソッド（fn）を書く。";
    case "trait":
      return "この { } はトレイトの定義本体。実装すべきメソッドのシグネチャを並べる。";
    case "mod":
      return "この { } はモジュールの中身。";
    case "match":
      return "この { } は match の腕を並べる場所。`パターン => 処理,` が並ぶ。";
    case "if":
      return "この { } は if の条件が真のときの処理。Rust の if は条件を ( ) で囲まないので、`{` の手前までが条件。";
    case "while":
      return "この { } は while の繰り返し本体。";
    case "for":
      return "この { } は for の繰り返し本体。";
    case "=>":
      return "この { } は match の腕の処理（ブロック）。";
    default:
      break;
  }
  if (
    prev &&
    (prev.type === "identifier" || prev.type === "type") &&
    /^[A-Z]/.test(pv) &&
    hasAssign
  )
    return `この { } は構造体 \`${pv}\` の値を作るリテラル。中は \`フィールド名: 値\`。`;
  if (prev && (prev.type === "identifier" || prev.type === "type") && /^[A-Z]/.test(pv))
    return `この { } は \`${pv}\` の値を作る（またはパターンで分解する）ための { }。中は \`フィールド名: 値\`。`;
  return "この { } は処理をまとめるブロック。ブロックも最後の式の値を返す「式」。";
}

function describeOpenParen(tokens: Token[], idx: number): string {
  const prev = prevMeaningful(tokens, idx);
  const pv = prev?.value ?? "";
  if (prev?.type === "identifier" && pv.endsWith("!"))
    return `この ( ) はマクロ \`${pv}\` に渡す引数。`;
  if (prev?.type === "identifier" || prev?.type === "type") {
    const before = prevMeaningful(tokens, prev.index);
    if (before?.value === "fn")
      return "この ( ) は関数の引数リストの定義。Rust では `名前: 型` のように**型の注釈が必須**。";
    if (RUST_VARIANTS.has(pv) || /^[A-Z]/.test(pv))
      return `この ( ) は \`${pv}\` に値を包む（または、パターンで中身を取り出す）。`;
    return `この ( ) は関数 \`${pv}\` の呼び出し。中が引数。`;
  }
  if (pv === "self" || pv === ">") return "この ( ) は関数・メソッドの呼び出し、または引数リスト。";
  const close = matchForward(tokens, idx);
  const after = close >= 0 ? nextMeaningful(tokens, close) : null;
  if (after?.value === "->") return "この ( ) は引数リスト。";
  return 'この ( ) はタプル、または計算の順番をまとめるグループ化。`(1, "a")` のように `,` があればタプル。';
}

function describeBracket(tokens: Token[], idx: number): TokenExplain {
  const t = tokens[idx];
  const base = { category: "括弧（closed-class・構造の骨）", klass: "closed" as const };
  if (t.value === "{") return { ...base, detail: describeOpenBrace(tokens, idx) };
  if (t.value === "(") return { ...base, detail: describeOpenParen(tokens, idx) };
  if (t.value === "[") {
    const prev = prevMeaningful(tokens, idx);
    if (prev?.type === "identifier" && prev.value.endsWith("!"))
      return {
        ...base,
        detail: `この [ ] はマクロ \`${prev.value}\` の中身（vec![1, 2, 3] なら Vec を作る）。`,
      };
    if (prev && (prev.type === "identifier" || prev.value === ")" || prev.value === "]"))
      return {
        ...base,
        detail: "この [ ] は添字（何番目かを指定して取り出す）。範囲外だと panic。",
      };
    if (prev?.value === ":" || prev?.value === "&" || prev?.value === "<")
      return {
        ...base,
        detail:
          "この [ ] は配列・スライスの型。`[i32; 3]` は i32 が 3 個の配列、`[i32]` はスライス。",
      };
    return { ...base, detail: "この [ ] は配列のリテラル。`[1, 2, 3]` や `[0; 5]`（0 を 5 個）。" };
  }
  // 閉じ括弧: 相方の開き括弧の説明を短く添える
  const openIdx = matchBackward(tokens, idx);
  if (openIdx >= 0) {
    const open = tokens[openIdx].value;
    const role =
      open === "{"
        ? describeOpenBrace(tokens, openIdx)
        : open === "("
          ? describeOpenParen(tokens, openIdx)
          : "";
    return {
      ...base,
      detail: `対応する開き ${open} とペア（クリックで相方が光る）。${role ? `\n${role}` : ""}`,
    };
  }
  return { ...base, detail: "対応する開き括弧とペア。" };
}

function describeOperator(tokens: Token[], idx: number): string {
  const v = tokens[idx].value;
  const prev = prevMeaningful(tokens, idx);
  const next = nextMeaningful(tokens, idx);
  const prevIsValue =
    !!prev &&
    (prev.type === "identifier" ||
      prev.type === "number" ||
      prev.type === "string" ||
      prev.value === ")" ||
      prev.value === "]");
  switch (v) {
    case "&":
      if (prevIsValue) return "ビット AND（両方の値に立っているビットだけ残す）。";
      return next?.value === "mut"
        ? "`&mut` で**可変の借用**（中身を変更できる参照）を作る。同時に 1 つしか作れない。"
        : "`&` で**借用**（参照）を作る。所有権を渡さずに値を貸す。不変の借用はいくつでも作れる。";
    case "*":
      return prevIsValue
        ? "掛け算。"
        : "参照外し（デリファレンス）。参照の先にある値そのものを取り出す。`*x += 1` など。";
    case "?":
      return "`?` 演算子。Result が Err（Option が None）なら、その場で関数から返す。Ok なら中身を取り出して続ける。";
    case "::":
      return "パス区切り。`型::関連関数`（`String::new()`）や `モジュール::名前`（`std::io`）、enum のバリアント（`Color::Red`）。";
    case ".":
      return "フィールドへのアクセス（`p.x`）、またはメソッド呼び出し（`v.len()`）。";
    case "..":
      return "範囲。`0..5` は 0〜4（5 を含まない）。構造体更新構文やパターンでは「残り全部」。";
    case "..=":
      return "末尾を含む範囲。`1..=5` は 1〜5。";
    case "|":
      return prevIsValue
        ? "ビット OR、またはパターンの「または」（`1 | 2 =>`）。"
        : "クロージャ（無名関数）の引数を囲む記号。`|x| x + 1` は x を受け取って x + 1 を返す関数。";
    case "||":
      return prevIsValue ? "論理和（または）。" : "引数なしのクロージャ `|| ...`、または論理和。";
    case "!":
      return "否定（not）。真偽値を反転する。";
    case "=":
      return "代入（束縛）。右の値を左の変数に結び付ける。";
    case "==":
      return "等しいかどうかの比較。";
    case "!=":
      return "等しくないかの比較。";
    case "<":
    case ">": {
      const p = prev?.value ?? "";
      if (prev?.type === "type" || (prev?.type === "identifier" && /^[A-Z]/.test(p)) || p === "fn")
        return "ジェネリクス（型引数）の山括弧。`Vec<i32>` は i32 の Vec、`<T>` は型の変数。";
      return v === "<"
        ? "より小さい（比較）、またはジェネリクスの山括弧。"
        : "より大きい（比較）、またはジェネリクスの山括弧。";
    }
    case "+=":
    case "-=":
    case "*=":
    case "/=":
      return `複合代入。\`x ${v} 1\` は \`x = x ${v[0]} 1\` と同じ（x は mut が必要）。`;
    case "&&":
      return "論理積（かつ）。";
    case "+":
      return "足し算（String では文字列の連結）。";
    case "-":
      return "引き算、または負の数。";
    case "/":
      return "割り算（整数どうしなら小数点以下切り捨て）。";
    case "%":
      return "割った余り。";
    default:
      return "値を計算・比較する記号。";
  }
}

function describePunct(v: string): string {
  const map: Record<string, string> = {
    ";": "文の終わり。式の最後に付けると値が捨てられる（関数の最後の式に付けると戻り値が () になる）。",
    ",": "区切り（引数・要素・フィールド・match の腕）。",
    ":": "型注釈の区切り（`x: i32`）、または構造体リテラルの `フィールド: 値`。",
  };
  return map[v] ?? "区切り記号。";
}

function describeIdentifier(t: Token): TokenExplain {
  const v = t.value;
  if (v.endsWith("!"))
    return {
      category: "マクロ呼び出し",
      klass: "closed",
      detail: `\`${v}\` はマクロ（末尾の \`!\` が目印）。関数と違って、引数の個数が自由だったりコードを生成したりできる。`,
    };
  if (RUST_VARIANTS.has(v)) {
    const d: Record<string, string> = {
      Some: "Option の「値がある」側のバリアント。`Some(5)` のように中身を包む。",
      None: "Option の「値がない」側のバリアント。Rust には null がない代わりにこれを使う。",
      Ok: "Result の「成功」側のバリアント。`Ok(値)`。",
      Err: "Result の「失敗」側のバリアント。`Err(エラー)`。",
    };
    return { category: "標準の enum バリアント", klass: "literal", detail: d[v] };
  }
  return {
    category: "名前（open-class・意味を運ぶ）",
    klass: "open",
    detail: /^[A-Z]/.test(v)
      ? "自分で付けた型・バリアントの名前（大文字で始める慣習）。骨格を読むだけなら中身は気にしなくていい。"
      : "自分で付けた名前（変数名・関数名・フィールド名。snake_case の慣習）。骨格を読むだけなら中身は気にしなくていい。",
  };
}

export function explainRustToken(tokens: Token[], idx: number): TokenExplain {
  const t = tokens[idx];
  switch (t.type) {
    case "keyword":
      return {
        category:
          t.value === "=>" || t.value === "->"
            ? "構造を作る記号（closed-class）"
            : "予約語（closed-class・構造）",
        klass: "closed",
        detail: KEYWORD_DESC[t.value] ?? "Rust にあらかじめ決まっている、構造を作る言葉。",
      };
    case "type":
      if (t.value.startsWith("'"))
        return {
          category: "ライフタイム",
          klass: "type",
          detail: `\`${t.value}\` はライフタイム（参照が有効な期間）の名前。「この参照はどれだけ長生きするか」をコンパイラに伝える注釈。`,
        };
      return {
        category: "型",
        klass: "type",
        detail: `\`${t.value}\` は型の名前。Rust は型にとても厳密で、関数の引数や戻り値には型の注釈が必須。`,
      };
    case "identifier":
      return describeIdentifier(t);
    case "string":
      return t.value.startsWith("'")
        ? {
            category: "文字リテラル",
            klass: "literal",
            detail: "`'a'` は 1 文字（char 型）。文字列はダブルクォート。",
          }
        : {
            category: "文字列リテラル",
            klass: "literal",
            detail:
              "ダブルクォートの文字列は &str 型（プログラムに埋め込まれた文字列への参照）。`{}` は println! などの埋め込み位置。",
          };
    case "number":
      return {
        category: "数値リテラル",
        klass: "literal",
        detail: /[a-z]\d/.test(t.value)
          ? "そのままの数値データ。末尾の `u8` `f64` などは型の指定（サフィックス）。"
          : "そのままの数値データ。`1_000` のように `_` で桁を区切れる。",
      };
    case "comment":
      return t.value.startsWith("#")
        ? {
            category: "属性（アトリビュート）",
            klass: "neutral",
            detail:
              "`#[...]` は直後の要素への指示。`#[derive(Debug)]` なら Debug トレイトの実装を自動生成する。",
          }
        : { category: "コメント", klass: "neutral", detail: "実行されないメモ書き。" };
    case "operator":
      return {
        category: "演算子（closed-class）",
        klass: "closed",
        detail: describeOperator(tokens, idx),
      };
    case "punct":
      return {
        category: "区切り記号（closed-class）",
        klass: "closed",
        detail: describePunct(t.value),
      };
    case "bracket":
      return describeBracket(tokens, idx);
    default:
      return { category: "", klass: "neutral", detail: "" };
  }
}
