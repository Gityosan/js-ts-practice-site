import { z } from "zod";
import type { IoGraderDef } from "../../grade/types";

const grader: IoGraderDef = {
  kind: "io",
  entry: "solve",
  outputSchema: z.number(),
  cases: [
    { label: "バラバラな正の数", input: [[3, 1, 4, 1, 5, 9, 2, 6]], expected: 9 },
    { label: "全部負の数", input: [[-1, -5, -2]], expected: -1 },
    { label: "1 要素", input: [[42]], expected: 42 },
    { label: "先頭が最大", input: [[100, 20, 30]], expected: 100 },
    { label: "末尾が最大", input: [[1, 2, 99]], expected: 99 },
  ],
  bonusCases: [
    { label: "Math.max() で最大値を取得した", pattern: "Math\\.max\\s*\\(" },
    { label: "スプレッド構文（...）を使った", pattern: "\\.\\.\\.\\s*\\w" },
    { label: "sort() で並べ替えてから取得した", pattern: "\\.sort\\s*\\(" },
  ],
};

export default grader;
