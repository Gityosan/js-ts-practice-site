import { defineProblem } from "../../core/schemas";

export default defineProblem({
  id: "bash-jq-sort-by-age",
  stage: "write",
  language: "bash",
  scenario: "jq",
  copy: {
    title: "jq で年齢順に並べ替える",
    prompt: `## やること

入力の \`users\` 配列を**年齢の昇順**に並べ替え、名前だけを 1 行ずつ出力する jq フィルタを書こう。

入力例:

\`\`\`json
{ "users": [
  { "name": "Bo", "age": 30 },
  { "name": "Aki", "age": 20 },
  { "name": "Cy", "age": 25 }
] }
\`\`\`

期待する出力:

\`\`\`
Aki
Cy
Bo
\`\`\`

## ヒント: sort_by

\`\`\`
.users | sort_by(.age) | .[].name
\`\`\`

- **\`sort_by(f)\`** は \`f\` の結果を基準に配列を**昇順**に並べ替える`,
    hints: ["`sort_by(.age)` で年齢の昇順に並べ替え", "そのあと `.[].name` で名前を取り出す"],
  },
  initialCode: `.users`,
  solutionCode: `.users | sort_by(.age) | .[].name`,
});
