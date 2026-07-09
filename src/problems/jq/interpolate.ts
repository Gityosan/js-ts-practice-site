import { defineProblem } from "../../core/schemas";

export default defineProblem({
  id: "bash-jq-interpolate",
  stage: "write",
  language: "bash",
  scenario: "jq",
  copy: {
    title: "jq で文字列を組み立てる（補間）",
    prompt: `## やること

各ユーザーを **\`名前 (年齢)\`** の形の文字列にして、1 行ずつ出力しよう。

入力例:

\`\`\`json
{ "users": [
  { "name": "Aki", "age": 20 },
  { "name": "Bo",  "age": 17 }
] }
\`\`\`

期待する出力:

\`\`\`
Aki (20)
Bo (17)
\`\`\`

## ヒント: 文字列補間 \\(...)

- jq の文字列補間は **\`"\\(式)"\`**（バックスラッシュと丸括弧）
- \`.users[]\` で各要素 → \`"\\(.name) (\\(.age))"\`
- 採点は \`-r\` 付き`,
    hints: [
      "`.users[]` で各ユーザーに展開する",
      '`"\\(.name) (\\(.age))"` の形で文字列を作る',
      '答えは `.users[] | "\\(.name) (\\(.age))"`',
    ],
  },
  initialCode: `.users[]`,
  solutionCode: `.users[] | "\\(.name) (\\(.age))"`,
});
