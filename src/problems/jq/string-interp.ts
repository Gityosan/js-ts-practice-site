import { defineProblem } from "../../core/schemas";

export default defineProblem({
  id: "bash-jq-string-interp",
  stage: "write",
  language: "bash",
  scenario: "jq",
  copy: {
    title: "jq で文字列を組み立てる",
    prompt: `## やること

入力の \`name\` と \`age\` を使って \`<name> is <age> years old\` という文章を出力する jq フィルタを書こう。

入力例:

\`\`\`json
{ "name": "Aki", "age": 20 }
\`\`\`

期待する出力: \`Aki is 20 years old\`

## ヒント: 文字列補間 \`\\(式)\`

\`\`\`
"\\(.name) is \\(.age) years old"
\`\`\`

- ダブルクオート文字列の中で **\`\\(式)\`** と書くと、式の評価結果がそこに埋め込まれる（JS のテンプレートリテラルの \${} に近い）`,
    hints: ['`"\\(.name) is \\(.age) years old"` のように埋め込む'],
  },
  initialCode: `.name`,
  solutionCode: `"\\(.name) is \\(.age) years old"`,
});
