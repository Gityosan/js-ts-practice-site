import { defineProblem } from "../../core/schemas";

export default defineProblem({
  id: "fill-entries-tax",
  stage: "fill",
  scenario: "data",
  copy: {
    title: "合計金額（税込み）を計算しよう",
    prompt: `## やること

商品名 → 税抜価格のマップと税率を受け取って、**全商品の税込み合計**を返す関数 \`solve\` を完成させよう。

\`\`\`ts
solve({ コーヒー: 500, サンドイッチ: 800 }, 0.1)
// → 1430  （(500 + 800) × 1.1）
\`\`\`

## ヒント: Object.entries の骨格

\`\`\`
Object.entries(オブジェクト)
  // → [["キー", 値], ["キー", 値], ...]
\`\`\`

エントリ（キーと値のペア配列）を取り出してから \`reduce\` で合計できる。`,
    hints: [
      "`Object.entries(menu)` で `[['コーヒー', 500], ['サンドイッチ', 800]]` の形になる",
      "`.reduce((acc, [, price]) => acc + price, 0)` で価格だけ合計できる（キー名は使わないので `[, price]` と分割代入）",
      "合計に `(1 + taxRate)` を掛けると税込み金額になる",
    ],
  },
  initialCode: `function solve(menu: Record<string, number>, taxRate: number): number {
  // ここに書こう

}`,
  solutionCode: `function solve(menu: Record<string, number>, taxRate: number): number {
  const subtotal = Object.entries(menu).reduce((acc, [, price]) => acc + price, 0);
  return Math.round(subtotal * (1 + taxRate));
}`,
});
