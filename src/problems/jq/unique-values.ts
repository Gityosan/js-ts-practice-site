import { defineProblem } from "../../core/schemas";

export default defineProblem({
  id: "bash-jq-unique-values",
  stage: "write",
  language: "bash",
  scenario: "jq",
  copy: {
    title: "jq で重複を除いて並べ替える",
    prompt: `## やること

入力の \`nums\` 配列から**重複を除いた**配列を出力する jq フィルタを書こう。

入力例:

\`\`\`json
{ "nums": [3, 1, 2, 3, 1, 4] }
\`\`\`

期待する出力: \`[1,2,3,4]\`

## ヒント: unique

\`\`\`
.nums | unique
\`\`\`

- **\`unique\`** は重複を除いた配列を返す。ついでに**昇順に並べ替わる**点に注意
- 採点は \`-c\`（コンパクト出力）付き`,
    hints: ["`.nums | unique`", "unique は重複除去と同時にソートもする"],
  },
  initialCode: `.nums`,
  solutionCode: `.nums | unique`,
});
