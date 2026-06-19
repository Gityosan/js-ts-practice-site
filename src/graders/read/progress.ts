import { z } from "zod";
import type { IoGraderDef } from "../../grade/types";

const grader: IoGraderDef = {
  kind: "io",
  entry: "solve",
  outputSchema: z.number(),
  cases: [
    {
      label: "実行できた（数値を返した）",
      input: [],
      expected: 0,
      skipValueCheck: true,
    },
  ],
};

export default grader;
