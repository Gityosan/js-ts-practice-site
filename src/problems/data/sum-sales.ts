import { z } from "zod";
import { defineProblem } from "../../core/schemas";

// zod-v4-mocks はNode.js専用（node:fs等依存）なのでテストファイル側で使用する
// ここでは SaleSchema でデータ構造を定義し、静的テストデータを使う
export const SaleSchema = z.object({
  id: z.string(),
  region: z.string(),
  amount: z.number().min(1).max(10000),
});
export type Sale = z.infer<typeof SaleSchema>;

const salesData: Sale[] = [
  { id: "sale-0", region: "東京", amount: 1200 },
  { id: "sale-1", region: "大阪", amount: 800 },
  { id: "sale-2", region: "東京", amount: 500 },
  { id: "sale-3", region: "福岡", amount: 300 },
  { id: "sale-4", region: "東京", amount: 900 },
];

export default defineProblem({
  id: "fill-sum-sales",
  stage: "fill",
  scenario: "data",
  copy: {
    title: "地域別売上を集計しよう（総合問題）",
    prompt: `## やること

売上データの配列から**東京の売上合計**を返す関数 \`solve\` を書こう。

\`\`\`ts
type Sale = { id: string; region: string; amount: number };

solve([
  { id: "s1", region: "東京", amount: 1200 },
  { id: "s2", region: "大阪", amount: 800 },
  { id: "s3", region: "東京", amount: 500 },
])
// → 1700
\`\`\`

## データエンジニアとして

型 \`Sale\` は \`id / region / amount\` を持つオブジェクト。
\`filter\` で東京だけ絞り、\`reduce\` で合計する2段階変換が定石。`,
    hints: [
      "Step 1: `sales.filter(s => s.region === '東京')` で東京だけ絞る",
      "Step 2: `.reduce((acc, s) => acc + s.amount, 0)` で合計",
      "チェーンで書くと `sales.filter(...).reduce(...)` とつなげられる",
    ],
  },
  initialCode: `type Sale = { id: string; region: string; amount: number };

function solve(sales: Sale[]): number {
  // ここに書こう

}`,
  solutionCode: `type Sale = { id: string; region: string; amount: number };

function solve(sales: Sale[]): number {
  return sales
    .filter(s => s.region === '東京')
    .reduce((acc, s) => acc + s.amount, 0);
}`,
  grader: {
    kind: "io",
    entry: "solve",
    outputSchema: z.number(),
    cases: [
      {
        input: [salesData],
        expected: salesData
          .filter((s) => s.region === "東京")
          .reduce((acc, s) => acc + s.amount, 0),
      },
      {
        input: [[{ id: "a", region: "東京", amount: 500 }]],
        expected: 500,
      },
      {
        input: [[{ id: "b", region: "大阪", amount: 999 }]],
        expected: 0,
      },
      {
        input: [[]],
        expected: 0,
      },
    ],
  },
});
