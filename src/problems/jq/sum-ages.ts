import { defineProblem } from "../../core/schemas";

export default defineProblem({
  id: "bash-jq-sum-ages",
  stage: "write",
  language: "bash",
  scenario: "jq",
  copy: {
    title: "jq で年齢の合計を求める",
    prompt: `## やること

入力の \`users\` 配列から**年齢(\`age\`)の合計**を出力する jq フィルタを書こう。

入力例:

\`\`\`json
{ "users": [{ "age": 20 }, { "age": 30 }, { "age": 15 }] }
\`\`\`

期待する出力: \`65\`

## ヒント: 配列にしてから add

\`\`\`
[.users[].age] | add
\`\`\`

- **\`[.users[].age]\`** は「各ユーザーの age」を集めて**新しい配列**にする（\`[ ]\` で囲むのがポイント）
- **\`add\`** は配列の全要素を合計する`,
    hints: [
      "`.users[].age` だけだと年齢が 1 個ずつバラバラに出力される",
      "`[ ]` で囲んで配列にまとめてから `add`",
    ],
  },
  initialCode: `.users[].age`,
  solutionCode: `[.users[].age] | add`,
});
