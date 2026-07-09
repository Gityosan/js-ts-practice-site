import { defineProblem } from "../../core/schemas";

export default defineProblem({
  id: "bash-jq-to-entries",
  stage: "write",
  language: "bash",
  scenario: "jq",
  copy: {
    title: "jq でオブジェクトを展開する（to_entries）",
    prompt: `## やること

オブジェクト \`scores\` を、**\`キー=値\`** の形にして 1 行ずつ出力しよう。

入力例:

\`\`\`json
{ "scores": { "math": 80, "eng": 90 } }
\`\`\`

期待する出力:

\`\`\`
math=80
eng=90
\`\`\`

## ヒント: to_entries

- **\`to_entries\`** はオブジェクトを \`[{key, value}, ...]\` の配列にする
- \`map("\\(.key)=\\(.value)")\` で各要素を文字列化 → \`| .[]\` で1行ずつ
- 採点は \`-r\` 付き`,
    hints: [
      "`.scores | to_entries` で `{key, value}` の配列になる",
      '`| map("\\(.key)=\\(.value)")` で "math=80" の形にする',
      '答えは `.scores | to_entries | map("\\(.key)=\\(.value)") | .[]`',
    ],
  },
  initialCode: `.scores | to_entries`,
  solutionCode: `.scores | to_entries | map("\\(.key)=\\(.value)") | .[]`,
});
