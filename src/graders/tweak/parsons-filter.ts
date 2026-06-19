import { z } from "zod";
import type { IoGraderDef } from "../../grade/types";

const grader: IoGraderDef = {
  kind: "io",
  entry: "solve",
  outputSchema: z.array(z.number()),
  cases: [
    { label: "1〜5 → 偶数", input: [[1, 2, 3, 4, 5]], expected: [2, 4] },
    { label: "全部偶数", input: [[2, 4, 6]], expected: [2, 4, 6] },
    { label: "全部奇数 → 空", input: [[1, 3, 5]], expected: [] },
    { label: "空配列", input: [[]], expected: [] },
  ],
};

export default grader;
