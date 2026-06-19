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
  bonusCases: [
    { label: "!! で boolean 変換した（二重否定）", pattern: "!!" },
    { label: "Boolean() で変換した", pattern: "Boolean\\s*\\(" },
    { label: "比較演算子で boolean を作った", pattern: "[><=!]={1,2}" },
  ],
};

export default grader;
