import { defineProblem } from "../../core/schemas";

export default defineProblem({
  id: "bash-jq-length",
  stage: "write",
  language: "bash",
  scenario: "jq",
  copy: {
    title: "jq で配列の要素数を数える",
    prompt: `## やること

入力 JSON の \`items\` 配列の**要素数**を出力する jq フィルタを書こう。

入力例:

\`\`\`json
{ "items": [1, 2, 3, 4] }
\`\`\`

期待する出力: \`4\`

## ヒント: length

\`\`\`
.items | length
\`\`\`

- **\`|\`** は前の結果を次のフィルタに渡すパイプ
- **\`length\`** は配列・文字列・オブジェクトの長さ（要素数）を返す`,
    hints: ["`.items` で配列を取り出す", "`| length` で要素数にする"],
  },
  initialCode: `.items`,
  solutionCode: `.items | length`,
});
