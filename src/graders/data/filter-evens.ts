import { z } from "zod";
import type { IoGraderDef } from "../../grade/types";

const grader: IoGraderDef = {
  kind: "io",
  entry: "solve",
  outputSchema: z.array(z.number()),
  cases: [
    { input: [[1, 2, 3, 4, 5]], expected: [2, 4] },
    { input: [[2, 4, 6]], expected: [2, 4, 6] },
    { input: [[1, 3, 5]], expected: [] },
    { input: [[]], expected: [] },
    { input: [[0, -2, 7]], expected: [0, -2] },
  ],
};

export default grader;
