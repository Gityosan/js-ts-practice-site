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
};

export default grader;
