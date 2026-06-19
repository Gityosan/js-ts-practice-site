import { z } from "zod";
import type { IoGraderDef } from "../../grade/types";

const grader: IoGraderDef = {
  kind: "io",
  entry: "solve",
  outputSchema: z.string(),
  cases: [
    {
      label: "実行できた（文字列を返した）",
      input: [],
      expected: "",
      skipValueCheck: true,
    },
  ],
  bonusCases: [
    { label: "+ 演算子で文字列を連結した", pattern: "[\"'`]\\s*\\+|\\+\\s*[\"'`]" },
    { label: ".concat() で連結した", pattern: "\\.concat\\s*\\(" },
  ],
};

export default grader;
