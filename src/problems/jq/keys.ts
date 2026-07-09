import { defineProblem } from "../../core/schemas";

export default defineProblem({
  id: "bash-jq-keys",
  stage: "write",
  language: "bash",
  scenario: "jq",
  copy: {
    title: "jq でキー一覧を出す（keys）",
    prompt: `## やること

オブジェクト \`config\` の **キー名**を、昇順で 1 行ずつ出力しよう。

入力例:

\`\`\`json
{ "config": { "b": 1, "a": 2, "c": 3 } }
\`\`\`

期待する出力:

\`\`\`
a
b
c
\`\`\`

## ヒント: keys

- **\`keys\`** はオブジェクトのキーを昇順の配列で返す
- \`.config | keys\` → \`| .[]\` で 1 行ずつ`,
    hints: [
      "`.config | keys` でキーの配列（昇順）になる",
      "`| .[]` で 1 行ずつ展開",
      "答えは `.config | keys | .[]`",
    ],
  },
  initialCode: `.config | keys`,
  solutionCode: `.config | keys | .[]`,
});
