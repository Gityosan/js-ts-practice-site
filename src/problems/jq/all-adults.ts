import { defineProblem } from "../../core/schemas";

export default defineProblem({
  id: "bash-jq-all-adults",
  stage: "write",
  language: "bash",
  scenario: "jq",
  copy: {
    title: "jq で全部を判定する（all）",
    prompt: `## やること

**全員が18歳以上か**を判定して、\`true\` または \`false\` を出力しよう。

入力例:

\`\`\`json
{ "users": [ { "age": 20 }, { "age": 30 } ] }
\`\`\`

期待する出力:

\`\`\`
true
\`\`\`

## ヒント: all

- **\`all(条件)\`** は、配列の全要素が条件を満たせば \`true\`
- \`.users | all(.age >= 18)\``,
    hints: [
      "入力は `.users` の配列",
      "`all(.age >= 18)` で全員が条件を満たすか判定",
      "答えは `.users | all(.age >= 18)`",
    ],
  },
  initialCode: `.users`,
  solutionCode: `.users | all(.age >= 18)`,
});
