import { describe, it, expect } from "vitest";
import { rustLearnProblems, rustProblems, rustWriteProblems } from "../problems/rust";
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

  it("write 問題と採点定義が 1 対 1 で対応している", () => {
    const writeIds = rustWriteProblems.map((p) => p.id).sort();
    const graderIds = Object.keys(rustGraders).sort();
    expect(graderIds).toEqual(writeIds);
    for (const p of rustWriteProblems) {
      expect(p.stage, p.id).toBe("write");
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
