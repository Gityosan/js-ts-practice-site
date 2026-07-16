import { defineProblem } from "../../core/schemas";

export default defineProblem({
  id: "bash-jq-alt-operator",
  stage: "write",
  language: "bash",
  scenario: "jq",
  copy: {
    title: "jq でデフォルト値を用意する",
    prompt: `## やること

入力に \`nickname\` フィールドがあればそれを、**なければ \`no-name\`** を出力する jq フィルタを書こう。

入力例:

\`\`\`json
{ "name": "Aki" }
\`\`\`

期待する出力: \`no-name\`

## ヒント: 代替演算子 \`//\`

\`\`\`
.nickname // "no-name"
\`\`\`

- **\`式A // 式B\`** は「式A が \`null\` または \`false\` のとき式B を使う」という代替演算子
- 存在しないフィールドにアクセスすると jq では \`null\` になる`,
    hints: [
      "存在しないフィールドは `null` になる",
      '`.nickname // "no-name"` で null のときのデフォルトを用意する',
    ],
  },
  initialCode: `.nickname`,
  solutionCode: `.nickname // "no-name"`,
});
