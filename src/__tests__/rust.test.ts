import { describe, it, expect } from "vitest";
import {
  rustDecodeProblems,
  rustLearnProblems,
  rustProblems,
  rustReadProblems,
  rustWriteProblems,
} from "../problems/rust";
import { tokenize, explainToken, matchBrackets } from "../lib/tokenize";
import { rustGraders } from "../graders/rust";
import { runGrader } from "../core/grader-node";
import { buildRustProgram, firstRustError, parseRustRun } from "../grade/rust";
import { rustcAvailable } from "../grade/rust-local";
import type { RustGraderDef } from "../grade/types";

// rustc が無い環境（Rust 未導入のローカルなど）では実行系のテストだけスキップする。
// CI（deploy.yml）は Rust ツールチェーンを入れてから実行する。
const hasRustc = rustcAvailable();
const RUST_TIMEOUT = 120_000;

describe("Rust 教材の構成", () => {
  it("id が重複していない", () => {
    const ids = rustProblems.map((p) => p.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("language / scenario が rust", () => {
    for (const p of rustProblems) {
      expect(p.language, p.id).toBe("rust");
      expect(p.scenario, p.id).toBe("rust");
    }
  });

  it("learn は learn ステージでクイズがある", () => {
    for (const p of rustLearnProblems) {
      expect(p.stage, p.id).toBe("learn");
      expect(p.learn?.quiz.length ?? 0, p.id).toBeGreaterThan(0);
      for (const q of p.learn!.quiz) {
        expect(q.choices, `${p.id}: ${q.prompt}`).toContain(q.answer);
        expect(new Set(q.choices).size, `${p.id}: 選択肢が重複 ${q.prompt}`).toBe(q.choices.length);
      }
    }
  });

  it("decode は decode ステージで、コードとクイズがある", () => {
    expect(rustDecodeProblems.length).toBeGreaterThan(0);
    for (const p of rustDecodeProblems) {
      expect(p.stage, p.id).toBe("decode");
      expect(p.decode?.code.trim(), p.id).toBeTruthy();
      expect(p.decode?.quiz.length ?? 0, p.id).toBeGreaterThan(0);
      for (const q of p.decode!.quiz) {
        expect(q.choices, `${p.id}: ${q.prompt}`).toContain(q.answer);
        expect(new Set(q.choices).size, `${p.id}: 選択肢が重複 ${q.prompt}`).toBe(q.choices.length);
      }
      // 分解しても原文に戻り、括弧がすべて対応している
      const toks = tokenize(p.decode!.code, "rust");
      expect(toks.map((t) => t.value).join(""), p.id).toBe(p.decode!.code);
      const brackets = toks.filter((t) => t.type === "bracket").length;
      expect(matchBrackets(toks).size, `${p.id}: 括弧の対応`).toBe(brackets);
      // どのトークンにも説明が付く
      for (const t of toks) {
        if (t.type === "whitespace") continue;
        expect(explainToken(toks, t.index, "rust").detail, `${p.id}: ${t.value}`).not.toBe("");
      }
    }
  });

  it("read は read ステージ", () => {
    expect(rustReadProblems.length).toBeGreaterThan(0);
    for (const p of rustReadProblems) expect(p.stage, p.id).toBe("read");
  });

  it("write / read 問題と採点定義が 1 対 1 で対応している", () => {
    const writeIds = [...rustWriteProblems, ...rustReadProblems].map((p) => p.id).sort();
    const graderIds = Object.keys(rustGraders).sort();
    expect(graderIds).toEqual(writeIds);
    for (const p of [...rustWriteProblems, ...rustReadProblems]) {
      expect(p.solutionCode.trim(), p.id).not.toBe("");
      expect(p.initialCode.trim(), p.id).not.toBe("");
    }
  });
});

describe("Rust 採点器の部品", () => {
  const harness: RustGraderDef = {
    kind: "rust",
    mode: "harness",
    cases: [
      { label: "a", expr: "1 + 1", expected: "2" },
      { label: "b", expr: "f()", expected: '"x"' },
    ],
  };

  it("harness は学習者コードの後ろに main を付け足す", () => {
    const program = buildRustProgram(harness, 'fn f() -> String { String::from("x") }');
    expect(program).toContain("fn f()");
    expect(program).toContain("fn main()");
    expect(program).toContain("catch_unwind");
  });

  it("マーカー行からケースごとの結果を作る（panic は部分点として残る）", () => {
    const results = parseRustRun(harness, {
      success: true,
      compileError: false,
      stdout:
        "noise\n@@ZVCASE0@@2\n@@ZVCASE1@@@@PANIC@@index out of bounds: the len is 0 but the index is 0\n",
      stderr: "",
    });
    expect(results[0].passed).toBe(true);
    expect(results[1].passed).toBe(false);
    expect(results[1].detail).toContain("範囲外");
  });

  it("コンパイルエラーはエラーコードと対訳を出す", () => {
    const stderr = `   Compiling playground v0.0.1\nerror[E0382]: borrow of moved value: \`s\`\n --> src/main.rs:4:20\n  |\n\nerror: aborting due to 1 previous error\n`;
    expect(firstRustError(stderr).code).toBe("E0382");
    const results = parseRustRun(harness, {
      success: false,
      compileError: true,
      stdout: "",
      stderr,
    });
    expect(results.every((r) => !r.passed)).toBe(true);
    expect(results[0].detail).toContain("所有権");
  });
});

describe("Rust の解読トークナイザ", () => {
  const kinds = (code: string) =>
    Object.fromEntries(
      tokenize(code, "rust")
        .filter((t) => t.type !== "whitespace")
        .map((t) => [t.value, t.type]),
    );

  it("予約語・型・名前・マクロ・ライフタイム・文字を分ける", () => {
    const k = kinds(`fn longest<'a>(x: &'a str) -> &'a str { println!("{}", 'c'); x }`);
    expect(k["fn"]).toBe("keyword");
    expect(k["longest"]).toBe("identifier");
    expect(k["'a"]).toBe("type");
    expect(k["str"]).toBe("type");
    expect(k["println!"]).toBe("identifier");
    expect(k["'c'"]).toBe("string");
    expect(k["->"]).toBe("keyword");
  });

  it("範囲 0..5 の .. を数値に含めない", () => {
    const vals = tokenize("for i in 0..5 {}", "rust").map((t) => t.value);
    expect(vals).toContain("0");
    expect(vals).toContain("..");
    expect(vals).toContain("5");
  });

  it("括弧の意味を直前の予約語で説明する", () => {
    const code = `fn add(a: i32) -> i32 { if a > 0 { a } else { 0 } }`;
    const toks = tokenize(code, "rust");
    const braces = toks.filter((t) => t.value === "{");
    expect(explainToken(toks, braces[0].index, "rust").detail).toContain("関数の本体");
    expect(explainToken(toks, braces[1].index, "rust").detail).toContain("if");
    expect(explainToken(toks, braces[2].index, "rust").detail).toContain("else");
    const paren = toks.find((t) => t.value === "(")!;
    expect(explainToken(toks, paren.index, "rust").detail).toContain("引数");
  });

  it("& と &mut と * を説明し分ける", () => {
    const toks = tokenize("let r = &mut x; *r += 1; let s = &y;", "rust");
    const amps = toks.filter((t) => t.value === "&");
    expect(explainToken(toks, amps[0].index, "rust").detail).toContain("可変の借用");
    expect(explainToken(toks, amps[1].index, "rust").detail).toContain("借用");
    const star = toks.find((t) => t.value === "*")!;
    expect(explainToken(toks, star.index, "rust").detail).toContain("参照外し");
  });
});

describe.skipIf(!hasRustc)("Rust の read 問題: そのままでも、模範解答でも実行できる", () => {
  for (const problem of rustReadProblems) {
    it(
      `${problem.id}: 初期コード・模範解答が実行できる`,
      async () => {
        for (const code of [problem.initialCode, problem.solutionCode]) {
          const result = await runGrader(problem.id, code);
          const failed = result.results
            .filter((r) => !r.passed)
            .map((r) => `${r.label}: ${r.detail}`);
          expect(failed, failed.join("\n")).toEqual([]);
        }
      },
      RUST_TIMEOUT,
    );
  }
});

describe.skipIf(!hasRustc)("Rust 問題: rustc で採点", () => {
  for (const problem of rustWriteProblems) {
    it(
      `${problem.id}: 模範解答が満点`,
      async () => {
        const result = await runGrader(problem.id, problem.solutionCode);
        const failed = result.results
          .filter((r) => !r.passed)
          .map((r) => `${r.label}: ${r.detail}`);
        expect(failed, failed.join("\n")).toEqual([]);
        expect(result.passed).toBe(result.total);
      },
      RUST_TIMEOUT,
    );

    it(
      `${problem.id}: 初期コードのままでは満点にならない`,
      async () => {
        const result = await runGrader(problem.id, problem.initialCode);
        expect(result.passed).toBeLessThan(result.total);
      },
      RUST_TIMEOUT,
    );
  }
});
