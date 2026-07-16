import { defineProblem } from "../../core/schemas";

export default defineProblem({
  id: "bash-jq-nested-path",
  stage: "write",
  language: "bash",
  scenario: "jq",
  copy: {
    title: "jq でネストしたフィールドを取る",
    prompt: `## やること

入力からネストした \`company.address.city\` を取り出す jq フィルタを書こう。

入力例:

\`\`\`json
{ "company": { "name": "Acme", "address": { "city": "Tokyo" } } }
\`\`\`

期待する出力: \`Tokyo\`

## ヒント: ドットを連ねる

\`\`\`
.company.address.city
\`\`\`

- \`.\`（ドット）を連ねるだけで何段でも下の階層にアクセスできる`,
    hints: ["`.company` → `.address` → `.city` とドットで繋げる"],
  },
  initialCode: `.company`,
  solutionCode: `.company.address.city`,
});
