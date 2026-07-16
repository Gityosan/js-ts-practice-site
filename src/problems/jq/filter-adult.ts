import { defineProblem } from "../../core/schemas";

export default defineProblem({
  id: "bash-jq-filter-adult",
  stage: "write",
  language: "bash",
  scenario: "jq",
  copy: {
    title: "jq で select して絞り込む",
    prompt: `## やること

入力の \`users\` 配列から、**18 歳以上のユーザーの名前だけ**を 1 行ずつ出力する jq フィルタを書こう。

入力例:

\`\`\`json
{ "users": [
  { "name": "Aki", "age": 20 },
  { "name": "Bo", "age": 15 },
  { "name": "Cy", "age": 18 }
] }
\`\`\`

期待する出力:

\`\`\`
Aki
Cy
\`\`\`

## ヒント: select

\`\`\`
.users[] | select(.age >= 18) | .name
\`\`\`

- **\`select(条件)\`** は条件が真の要素だけを次のパイプに流す（偽の要素は消える）`,
    hints: [
      "`.users[]` で 1 要素ずつに展開してから `select` する",
      "`select(.age >= 18)` で条件を満たす要素だけ残す",
      "最後に `.name` で名前を取り出す",
    ],
  },
  initialCode: `.users[]`,
  solutionCode: `.users[] | select(.age >= 18) | .name`,
});
