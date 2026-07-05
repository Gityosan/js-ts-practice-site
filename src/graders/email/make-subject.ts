import { z } from "zod";
import type { IoGraderDef } from "../../grade/types";

const grader: IoGraderDef = {
  kind: "io",
  entry: "solve",
  outputSchema: z.string(),
  cases: [
    {
      label: '"田中", "2024/01/15" → "田中様 週次レポート（2024/01/15）"',
      input: ["田中", "2024/01/15"],
      expected: "田中様 週次レポート（2024/01/15）",
    },
    {
      label: '"佐藤", "2024/02/01" → "佐藤様 週次レポート（2024/02/01）"',
      input: ["佐藤", "2024/02/01"],
      expected: "佐藤様 週次レポート（2024/02/01）",
    },
    {
      label: '"鈴木", "2024/12/31" → "鈴木様 週次レポート（2024/12/31）"',
      input: ["鈴木", "2024/12/31"],
      expected: "鈴木様 週次レポート（2024/12/31）",
    },
    {
      label: "空文字の宛先",
      input: ["", "2024/06/01"],
      expected: "様 週次レポート（2024/06/01）",
    },
  ],
  bonusCases: [
    { label: "+ 演算子で文字列を連結した", pattern: "[\"'`]\\s*\\+|\\+\\s*[\"'`]" },
    { label: ".concat() で連結した", pattern: "\\.concat\\s*\\(" },
  ],
  visualize: (output, input) => ({
    kind: "emails",
    sent: [
      {
        to: `${String(input[0] ?? "")}様`,
        subject: String(output ?? ""),
        body: "（本文は別問題で）",
      },
    ],
  }),
};

export default grader;
