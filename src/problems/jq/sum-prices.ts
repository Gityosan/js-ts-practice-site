import { defineProblem } from "../../core/schemas";

export default defineProblem({
  id: "bash-jq-sum-prices",
  stage: "write",
  language: "bash",
  scenario: "jq",
  copy: {
    title: "jq で合計する（add）",
    prompt: `## やること

入力の商品リストから、**価格の合計**を出力しよう。

入力例:

\`\`\`json
{ "items": [
  { "name": "pen",    "price": 120 },
  { "name": "note",   "price": 300 },
  { "name": "eraser", "price": 80 }
] }
\`\`\`

期待する出力:

\`\`\`
500
\`\`\`

## ヒント: 配列を作って add

- **\`add\`** は配列の要素を全部足す
- まず価格だけの配列を作る: **\`[.items[].price]\`**（\`[ ]\` で囲むと配列になる）
- それを \`| add\` で合計`,
    hints: [
      "`.items[].price` は価格を1つずつ出す（配列ではない）",
      "`[ ... ]` で囲むと配列になる: `[.items[].price]`",
      "答えは `[.items[].price] | add`",
    ],
  },
  initialCode: `.items[].price`,
  solutionCode: `[.items[].price] | add`,
});
