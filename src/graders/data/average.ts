import { z } from "zod";
import type { IoGraderDef } from "../../grade/types";

const grader: IoGraderDef = {
  kind: "io",
  entry: "solve",
  outputSchema: z.number(),
  cases: [
    { label: "3 要素の平均", input: [[10, 20, 30]], expected: 20 },
    { label: "小数点の平均", input: [[1, 2]], expected: 1.5 },
    { label: "1 要素", input: [[42]], expected: 42 },
    { label: "空配列 → 0", input: [[]], expected: 0 },
    { label: "負の数を含む", input: [[-10, 0, 10]], expected: 0 },
  ],
  bonusCases: [
    { label: "for ループで合計した", pattern: "for\\s*\\(" },
    { label: "reduce で合計した", pattern: "\\.reduce\\s*\\(" },
  ],
};

export default grader;
