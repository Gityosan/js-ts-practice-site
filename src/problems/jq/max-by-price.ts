import { defineProblem } from "../../core/schemas";

export default defineProblem({
  id: "bash-jq-max-by-price",
  stage: "write",
  language: "bash",
  scenario: "jq",
  copy: {
    title: "jq で最大の要素を取る（max_by）",
    prompt: `## やること

商品の中で **一番高いものの名前** を出力しよう。

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
note
\`\`\`

## ヒント: max_by

- **\`max_by(.price)\`** は指定キーが最大の**要素そのもの**を返す（値ではない）
- \`.items | max_by(.price)\` → \`| .name\` で名前`,
    hints: [
      "`.items | max_by(.price)` で一番高い商品オブジェクトが取れる",
      "`| .name` で名前だけにする",
      "答えは `.items | max_by(.price) | .name`",
    ],
  },
  initialCode: `.items | max_by(.price)`,
  solutionCode: `.items | max_by(.price) | .name`,
});
