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
  bonusCases: [
    { label: "rgb() で色を指定した", pattern: "rgb\\s*\\(" },
    { label: "hsl() で色を指定した", pattern: "hsl\\s*\\(" },
    { label: "16進数カラーコードで指定した", pattern: "#[0-9a-fA-F]{3,6}" },
  ],
};

export default grader;
