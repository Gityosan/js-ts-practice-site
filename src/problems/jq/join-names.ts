import { defineProblem } from "../../core/schemas";

export default defineProblem({
  id: "bash-jq-join-names",
  stage: "write",
  language: "bash",
  scenario: "jq",
  copy: {
    title: "jq で1行に連結する（join）",
    prompt: `## やること

ユーザーの名前を **「, 」でつないで1行** に出力しよう。

入力例:

\`\`\`json
{ "users": [ { "name": "Aki" }, { "name": "Bo" } ] }
\`\`\`

期待する出力:

\`\`\`
Aki, Bo
\`\`\`

## ヒント: map と join

- \`join\` は**文字列の配列**をつなぐので、先に名前だけの配列を作る
- \`.users | map(.name)\` で \`["Aki","Bo"]\` → \`| join(", ")\`
- 採点は \`-r\` 付き`,
    hints: [
      "`.users | map(.name)` で名前の配列にする",
      '`| join(", ")` で連結（区切りは ", "）',
      '答えは `.users | map(.name) | join(", ")`',
    ],
  },
  initialCode: `.users | map(.name)`,
  solutionCode: `.users | map(.name) | join(", ")`,
});
