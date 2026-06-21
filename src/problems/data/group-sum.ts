import { defineProblem } from "../../core/schemas";

export default defineProblem({
  id: "write-group-sum",
  stage: "write",
  scenario: "data",
  copy: {
    title: "キー別に値を集計する",
    prompt: `## やること

売上データの配列を受け取り、**地域ごとの合計金額**を返す関数 \`solve\` を書こう。

\`\`\`ts
solve([
  { region: "東", amount: 100 },
  { region: "西", amount: 200 },
  { region: "東", amount: 300 },
])
// → { 東: 400, 西: 200 }
\`\`\`

## 考え方

\`reduce\` で空オブジェクト \`{}\` から始め、各行の \`region\` をキーに \`amount\` を足し込んでいく。
「まだそのキーが無ければ 0 から数える」は \`?? 0\` で書ける。

## 型のヒント

\`\`\`ts
type Sale = { region: string; amount: number };
function solve(sales: Sale[]): Record<string, number> { ... }
\`\`\``,
    hints: [
      "`reduce` の初期値を `{}` にすると、キーごとに値を積み上げるオブジェクトが作れる",
      "`acc[s.region] = (acc[s.region] ?? 0) + s.amount` で「あれば加算、なければ 0 から開始」",
      "`return acc;` を忘れずに — reduce のコールバックは必ず accumulator を返す",
    ],
  },
  initialCode: `type Sale = { region: string; amount: number };
function solve(sales: Sale[]): Record<string, number> {
  // ここに書こう
}
`,
  solutionCode: `type Sale = { region: string; amount: number };
function solve(sales: Sale[]): Record<string, number> {
  return sales.reduce<Record<string, number>>((acc, s) => {
    acc[s.region] = (acc[s.region] ?? 0) + s.amount;
    return acc;
  }, {});
}`,
});
