import { z } from "zod";
import type { IoGraderDef } from "../../grade/types";

const grader: IoGraderDef = {
  kind: "io",
  entry: "solve",
  outputSchema: z.string(),
  cases: [
    {
      label: "実行できた（色名の文字列を返した）",
      input: [],
      expected: "",
      skipValueCheck: true,
    },
  ],
};

export default grader;
