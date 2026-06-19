import { z } from "zod";
import type { IoGraderDef } from "../../grade/types";

const grader: IoGraderDef = {
  kind: "io",
  entry: "solve",
  outputSchema: z.number(),
  cases: [
    { label: "3 要素の合計", input: [[1, 2, 3]], expected: 6 },
    { label: "大きめの数", input: [[10, 20, 30]], expected: 60 },
    { label: "空配列 → 0", input: [[]], expected: 0 },
    { label: "1 要素", input: [[42]], expected: 42 },
  ],
};

export default grader;
