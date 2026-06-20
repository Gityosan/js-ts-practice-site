import { describe, it, expect } from "vitest";
import { allProblems } from "../problems";
import { runGrader } from "../core/grader-node";

describe("全問題: 模範解答が満点を取ること", () => {
  // decode は実行しない（解読教材）ので採点対象外
  for (const problem of allProblems.filter((p) => p.stage !== "decode")) {
    it(`${problem.id}: 模範解答が満点`, async () => {
      const result = await runGrader(problem.id, problem.solutionCode);
      expect(result.passed, `passed=${result.passed} / total=${result.total}`).toBe(result.total);
    });
  }
});
