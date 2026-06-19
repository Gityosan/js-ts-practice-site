import { z } from "zod";
import type { IoGraderDef } from "../../grade/types";

const grader: IoGraderDef = {
  kind: "io",
  entry: "solve",
  outputSchema: z.number(),
  cases: [
    { input: [[1, 2, 3]], expected: 6 },
    { input: [[10, 20, 30]], expected: 60 },
    { input: [[]], expected: 0 },
    { input: [[-1, 1]], expected: 0 },
    { input: [[100]], expected: 100 },
  ],
  bonusCases: [
    { label: "for ループで合計した", pattern: "for\\s*\\(" },
    { label: "forEach で合計した", pattern: "\\.forEach\\s*\\(" },
    { label: "reduce で合計した", pattern: "\\.reduce\\s*\\(" },
  ],
};

export default grader;
