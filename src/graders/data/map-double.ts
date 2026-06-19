import { z } from "zod";
import type { IoGraderDef } from "../../grade/types";

const grader: IoGraderDef = {
  kind: "io",
  entry: "solve",
  outputSchema: z.array(z.number()),
  cases: [
    { input: [[10, 20, 30]], expected: [20, 40, 60] },
    { input: [[1, 2, 3]], expected: [2, 4, 6] },
    { input: [[]], expected: [] },
    { input: [[0, 5]], expected: [0, 10] },
    { input: [[-3, 4]], expected: [-6, 8] },
  ],
  assertMethod: "map",
  bonusCases: [
    { label: "n + n で 2 倍にした", pattern: "n\\s*\\+\\s*n" },
    { label: "ビットシフト（<< 1）で 2 倍にした", pattern: "<<\\s*1" },
  ],
};

export default grader;
