import { defineProblem } from "../../core/schemas";

export default defineProblem({
  id: "bash-jq-reduce-sum",
  stage: "write",
  language: "bash",
  scenario: "jq",
  copy: {
    title: "jq で畳み込む（reduce）",
    prompt: `## やること

\`nums\` の数値を **reduce で合計** して出力しよう（\`add\` は使わずに）。

入力例:

\`\`\`json
{ "nums": [1, 2, 3, 4] }
\`\`\`

期待する出力:

\`\`\`
10
\`\`\`

## ヒント: reduce

- 形は **\`reduce ソース as $変数 (初期値; 更新式)\`**
- ソースは \`.nums[]\`（各要素）、初期値は \`0\`、更新式は \`. + $n\`
- \`.\` は「今までの合計（アキュムレータ）」`,
    hints: [
      "`reduce .nums[] as $n (0; ...)` の形",
      "更新式は `. + $n`（`.` が現在の合計）",
      "答えは `reduce .nums[] as $n (0; . + $n)`",
    ],
  },
  initialCode: `reduce .nums[] as $n (0; )`,
  solutionCode: `reduce .nums[] as $n (0; . + $n)`,
});
