import { defineProblem } from "../../core/schemas";

export default defineProblem({
  id: "bash-jq-count",
  stage: "write",
  language: "bash",
  scenario: "jq",
  copy: {
    title: "jq で個数を数える（length）",
    prompt: `## やること

入力の \`users\` 配列に、**何人いるか**（要素数）を出力しよう。

入力例:

\`\`\`json
{ "users": [ { "name": "Aki" }, { "name": "Bo" }, { "name": "Zoe" } ] }
\`\`\`

期待する出力:

\`\`\`
3
\`\`\`

## ヒント: length

- **\`length\`** は、配列に使うと要素数、文字列に使うと文字数を返す
- \`.users\` で配列を取り出し、\`| length\` を付ける`,
    hints: [
      "`.users` で配列を取り出す",
      "`| length` を付けると個数になる",
      "答えは `.users | length`",
    ],
  },
  initialCode: `.users`,
  solutionCode: `.users | length`,
});
