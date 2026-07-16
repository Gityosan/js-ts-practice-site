import { defineProblem } from "../../core/schemas";

export default defineProblem({
  id: "bash-jq-first-user-name",
  stage: "write",
  language: "bash",
  scenario: "jq",
  copy: {
    title: "jq で先頭要素のフィールドを取る",
    prompt: `## やること

入力の \`users\` 配列の**先頭のユーザーの名前**だけを出力する jq フィルタを書こう。

入力例:

\`\`\`json
{ "users": [{ "name": "Aki" }, { "name": "Bo" }] }
\`\`\`

期待する出力: \`Aki\`

## ヒント: インデックス指定

\`\`\`
.users[0].name
\`\`\`

- **\`.users[0]\`** は配列の 0 番目（先頭）の要素
- そのあとに \`.name\` を続ければフィールドを取り出せる
- 採点は \`-r\`（raw 出力）付きなので \`"Aki"\` ではなく \`Aki\` と出る`,
    hints: ["`.users[0]` で先頭要素を取る", "`.users[0].name` で名前フィールドへ"],
  },
  initialCode: `.users[0]`,
  solutionCode: `.users[0].name`,
});
