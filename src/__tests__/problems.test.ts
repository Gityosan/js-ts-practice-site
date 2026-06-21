import { describe, it, expect } from "vitest";
import { allProblems } from "../problems";
import { runGrader } from "../core/grader-node";

describe("全問題: 模範解答が満点を取ること", () => {
  // decode / learn は実行しない（教材＋クイズ）ので採点対象外
  for (const problem of allProblems.filter((p) => p.stage !== "decode" && p.stage !== "learn")) {
    it(`${problem.id}: 模範解答が満点`, async () => {
      const result = await runGrader(problem.id, problem.solutionCode);
      expect(result.passed, `passed=${result.passed} / total=${result.total}`).toBe(result.total);
    });
  }
});
