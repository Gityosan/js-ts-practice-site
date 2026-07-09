import { defineProblem } from "../../core/schemas";

export default defineProblem({
  id: "bash-jq-flatten",
  stage: "write",
  language: "bash",
  scenario: "jq",
  copy: {
    title: "jq で入れ子をならす（flatten）",
    prompt: `## やること

配列の配列を **1段の配列** にならして出力しよう。

入力例:

\`\`\`json
{ "matrix": [ [1, 2], [3], [4, 5] ] }
\`\`\`

期待する出力（\`-c\`）:

\`\`\`
[1,2,3,4,5]
\`\`\`

## ヒント: flatten

- **\`flatten\`** は入れ子の配列を平らにする
- \`.matrix | flatten\``,
    hints: [
      "入力は `.matrix`（配列の配列）",
      "`| flatten` で 1 段にする",
      "答えは `.matrix | flatten`",
    ],
  },
  initialCode: `.matrix`,
  solutionCode: `.matrix | flatten`,
});
