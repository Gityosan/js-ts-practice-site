import { defineProblem } from "../../core/schemas";

export default defineProblem({
  id: "bash-jq-if-then-else",
  stage: "write",
  language: "bash",
  scenario: "jq",
  copy: {
    title: "jq で条件分岐する",
    prompt: `## やること

入力の \`score\` が **60 以上なら \`pass\`、そうでなければ \`fail\`** と出力する jq フィルタを書こう。

入力例:

\`\`\`json
{ "score": 85 }
\`\`\`

期待する出力: \`pass\`

## ヒント: if / then / else / end

\`\`\`
if .score >= 60 then "pass" else "fail" end
\`\`\`

- jq の \`if\` 式は **\`end\`** で必ず閉じる（JS の \`if\` と違い式として値を返す）`,
    hints: ["`if 条件 then 値1 else 値2 end` の形", "`end` を忘れずに"],
  },
  initialCode: `.score`,
  solutionCode: `if .score >= 60 then "pass" else "fail" end`,
});
