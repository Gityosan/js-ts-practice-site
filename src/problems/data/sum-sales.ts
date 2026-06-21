import { z } from "zod";
import { defineProblem } from "../../core/schemas";

export const SaleSchema = z.object({
  id: z.string(),
  region: z.string(),
  amount: z.number().min(1).max(10000),
});
export type Sale = z.infer<typeof SaleSchema>;

export default defineProblem({
  id: "fill-sum-sales",
  stage: "fill",
  scenario: "data",
  copy: {
    title: "データを集計する",
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
});
