import { defineProblem } from "../../core/schemas";

export default defineProblem({
  id: "bash-sh-array-filter",
  stage: "write",
  language: "bash",
  scenario: "sh",
  copy: {
    title: "配列を条件で絞り込む",
    prompt: `## やること

すでに宣言されている配列 \`nums\` から、**5 より大きい値だけ**を元の順番のまま 1 行ずつ出力するスクリプトを書こう（\`grep\` は使わない）。

## ヒント: for + if

\`\`\`bash
nums=(2 8 3 10 5 7)
for n in "\${nums[@]}"; do
  if (( n > 5 )); then
    echo "$n"
  fi
done
\`\`\`

- 配列を \`for\` でまわしながら、要素ごとに \`if\` で条件判定するだけ`,
    hints: [
      '`for n in "${nums[@]}"; do ... done` で全要素をまわす',
      '`if (( n > 5 )); then echo "$n"; fi`',
    ],
  },
  initialCode: `nums=(2 8 3 10 5 7)
# ここに for + if を書こう`,
  solutionCode: `nums=(2 8 3 10 5 7)
for n in "\${nums[@]}"; do
  if (( n > 5 )); then
    echo "$n"
  fi
done`,
});
