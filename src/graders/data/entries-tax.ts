import { z } from "zod";
import type { IoGraderDef } from "../../grade/types";

const grader: IoGraderDef = {
  kind: "io",
  entry: "solve",
  outputSchema: z.number(),
  cases: [
    {
      label: "コーヒーとサンドイッチ（10%）",
      input: [{ コーヒー: 500, サンドイッチ: 800 }, 0.1],
      expected: 1430,
    },
    {
      label: "1 品（8%）",
      input: [{ りんご: 200 }, 0.08],
      expected: 216,
    },
    {
      label: "税率 0%（税なし）",
      input: [{ A: 100, B: 200 }, 0],
      expected: 300,
    },
    {
      label: "空メニュー",
      input: [{}, 0.1],
      expected: 0,
    },
    {
      label: "3 品（10%）",
      input: [{ ラテ: 600, クッキー: 300, ジュース: 400 }, 0.1],
      expected: 1430,
    },
  ],
  assertMethod: "entries",
  bonusCases: [
    { label: "分割代入（const [k, v]）で受け取った", pattern: "const\\s*\\[" },
    { label: "toFixed() で小数を丸めた", pattern: "\\.toFixed\\s*\\(" },
    { label: "Math.round() で丸めた", pattern: "Math\\.round\\s*\\(" },
  ],
};

export default grader;
