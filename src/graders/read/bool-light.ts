import { z } from "zod";
import type { IoGraderDef } from "../../grade/types";

const grader: IoGraderDef = {
  kind: "io",
  entry: "solve",
  outputSchema: z.boolean(),
  cases: [
    {
      label: "実行できた（true か false を返した）",
      input: [],
      expected: false,
      skipValueCheck: true,
    },
  ],
};

export default grader;
