import { defineProblem } from "../../core/schemas";

export default defineProblem({
  id: "bash-jq-group-count",
  stage: "write",
  language: "bash",
  scenario: "jq",
  copy: {
    title: "jq でグループごとの件数を数える",
    prompt: `## やること

入力の \`users\` 配列を \`team\` フィールドでグループ化し、**各グループの件数**を配列で出力する jq フィルタを書こう。

入力例:

\`\`\`json
{ "users": [
  { "team": "A" }, { "team": "B" },
  { "team": "A" }, { "team": "A" }, { "team": "B" }
] }
\`\`\`

期待する出力: \`[3,2]\`（A チーム3人、B チーム2人）

## ヒント: group_by と map(length)

\`\`\`
.users | group_by(.team) | map(length)
\`\`\`

- **\`group_by(f)\`** は \`f\` の値が同じ要素同士をまとめ、グループの配列（配列の配列）を作る。グループは \`f\` の値の昇順に並ぶ
- **\`map(length)\`** で各グループの要素数に変換する`,
    hints: [
      "`group_by(.team)` でチームごとにまとめる",
      "結果は「グループの配列」なので `map(length)` で件数の配列にする",
    ],
  },
  initialCode: `.users`,
  solutionCode: `.users | group_by(.team) | map(length)`,
});
