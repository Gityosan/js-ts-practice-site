import { z } from "zod";
import { objectsToTable } from "../../grade/visual";
import type { IoGraderDef } from "../../grade/types";

const grader: IoGraderDef = {
  kind: "io",
  entry: "solve",
  outputSchema: z.array(z.record(z.string(), z.string())),
  cases: [
    {
      label: "ヘッダー2列・データ2行",
      input: [[["name", "price"], ["りんご", "120"], ["バナナ", "80"]]],
      expected: [
        { name: "りんご", price: "120" },
        { name: "バナナ", price: "80" },
      ],
    },
    {
      label: "ヘッダー3列・データ2行",
      input: [[["id", "name", "score"], ["1", "田中", "85"], ["2", "佐藤", "92"]]],
      expected: [
        { id: "1", name: "田中", score: "85" },
        { id: "2", name: "佐藤", score: "92" },
      ],
    },
    {
      label: "データ行なし（空配列）",
      input: [[["name", "price"]]],
      expected: [],
    },
    {
      label: "ヘッダー1列・データ3行",
      input: [[["item"], ["A"], ["B"], ["C"]]],
      expected: [{ item: "A" }, { item: "B" }, { item: "C" }],
    },
  ],
  bonusCases: [
    { label: "Object.fromEntries() を使った", pattern: "Object\\.fromEntries\\s*\\(" },
    { label: "for...of で行を繰り返した", pattern: "for\\s*\\(.*of\\s" },
    { label: "reduce でまとめた", pattern: "\\.reduce\\s*\\(" },
  ],
  visualize: (output) =>
    objectsToTable(Array.isArray(output) ? (output as Record<string, unknown>[]) : []),
};

export default grader;
