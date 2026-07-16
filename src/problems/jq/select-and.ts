import { defineProblem } from "../../core/schemas";

export default defineProblem({
  id: "bash-jq-select-and",
  stage: "write",
  language: "bash",
  scenario: "jq",
  copy: {
    title: "jq で複数条件を組み合わせる",
    prompt: `## やること

入力の \`users\` 配列から、**18 歳以上 かつ \`active\` が true** のユーザーの名前だけを出力する jq フィルタを書こう。

入力例:

\`\`\`json
{ "users": [
  { "name": "Aki", "age": 25, "active": true },
  { "name": "Bo", "age": 17, "active": true },
  { "name": "Cy", "age": 30, "active": false }
] }
\`\`\`

期待する出力: \`Aki\`

## ヒント: and でつなぐ

\`\`\`
.users[] | select(.age >= 18 and .active) | .name
\`\`\`

- **\`条件A and 条件B\`** で両方満たすときだけ真になる
- \`.active\` が \`true\`/\`false\` の真偽値ならそのまま条件として使える`,
    hints: [
      "`select(.age >= 18 and .active)` のように `and` でつなぐ",
      "`.active` は真偽値なのでそのまま条件に使える",
    ],
  },
  initialCode: `.users[]`,
  solutionCode: `.users[] | select(.age >= 18 and .active) | .name`,
});
