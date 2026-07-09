import { defineProblem } from "../../core/schemas";

export default defineProblem({
  id: "bash-jq-select-adults",
  stage: "write",
  language: "bash",
  scenario: "jq",
  copy: {
    title: "jq で条件で絞り込む（select）",
    prompt: `## やること

入力のユーザーから、**20歳以上（大人）の名前だけ**を 1 行ずつ出力しよう。

入力例:

\`\`\`json
{ "users": [
  { "name": "Aki", "age": 20 },
  { "name": "Bo",  "age": 17 },
  { "name": "Zoe", "age": 42 }
] }
\`\`\`

期待する出力:

\`\`\`
Aki
Zoe
\`\`\`

## ヒント: select

- **\`select(条件)\`** は、条件が真の要素だけを通すフィルタ
- \`.users[]\` で各要素に展開 → \`select(.age >= 20)\` で絞り込み → \`.name\` で名前
- パイプ **\`|\`** でつなぐ。採点は \`-r\` 付き`,
    hints: [
      "`.users[] | select(.age >= 20)` でまず大人の要素だけにする",
      "その後ろに `| .name` を足して名前を取り出す",
      "答えは `.users[] | select(.age >= 20) | .name`",
    ],
  },
  initialCode: `.users[]`,
  solutionCode: `.users[] | select(.age >= 20) | .name`,
});
