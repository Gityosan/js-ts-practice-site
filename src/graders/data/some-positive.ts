import { z } from "zod";
import type { IoGraderDef } from "../../grade/types";

const grader: IoGraderDef = {
  kind: "io",
  entry: "solve",
  outputSchema: z.boolean(),
  cases: [
    { label: "正の数あり", input: [[1, -2, -3]], expected: true },
    { label: "全部負", input: [[-1, -2, -3]], expected: false },
    { label: "空配列", input: [[]], expected: false },
    { label: "ゼロのみ（0 は正ではない）", input: [[0, 0]], expected: false },
    { label: "最後だけ正", input: [[-5, -3, 2]], expected: true },
  ],
  assertMethod: "some",
  bonusCases: [
    { label: "Math.sign() で正負を判定した", pattern: "Math\\.sign" },
    { label: "> 0 で正の数を判定した", pattern: ">\\s*0" },
  ],
};

export default grader;
