import { z } from "zod";
import type { IoGraderDef } from "../../grade/types";

const grader: IoGraderDef = {
  kind: "io",
  entry: "solve",
  outputSchema: z.array(z.number()),
  cases: [
    { label: "1,2,3 → 2倍", input: [[1, 2, 3]], expected: [2, 4, 6] },
    { label: "10,20 → 2倍", input: [[10, 20]], expected: [20, 40] },
    { label: "空配列", input: [[]], expected: [] },
    { label: "負の数も2倍", input: [[-3, 4]], expected: [-6, 8] },
  ],
};

export default grader;
