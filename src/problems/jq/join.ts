import { defineProblem } from "../../core/schemas";

export default defineProblem({
  id: "bash-jq-join",
  stage: "write",
  language: "bash",
  scenario: "jq",
  copy: {
    title: "jq で配列を文字列に結合する",
    prompt: `## やること

入力の \`tags\` 配列（文字列の配列）を \`", "\` 区切りで 1 本の文字列に結合する jq フィルタを書こう。

入力例:

\`\`\`json
{ "tags": ["red", "green", "blue"] }
\`\`\`

期待する出力: \`red, green, blue\`

## ヒント: join

\`\`\`
.tags | join(", ")
\`\`\`

- **\`join(区切り文字)\`** は文字列の配列を 1 本の文字列にまとめる（JS の \`Array.prototype.join\` と同じ発想）`,
    hints: ['`.tags | join(", ")`'],
  },
  initialCode: `.tags`,
  solutionCode: `.tags | join(", ")`,
});
