import { defineProblem } from "../../core/schemas";

export default defineProblem({
  id: "bash-sh-nested-loop",
  stage: "write",
  language: "bash",
  scenario: "sh",
  copy: {
    title: "ネストした for で九九を作る",
    prompt: `## やること

1〜3 × 1〜3 の掛け算結果を \`i x j = 結果\` の形で出力するスクリプトを書こう（for を 2 重に使う）。

期待する出力（先頭 3 行）:

\`\`\`
1 x 1 = 1
1 x 2 = 2
1 x 3 = 3
...
\`\`\`

## ヒント: for のネスト

\`\`\`bash
for ((i=1;i<=3;i++)); do
  for ((j=1;j<=3;j++)); do
    echo "$i x $j = $((i*j))"
  done
done
\`\`\`

- 外側の \`for\` が 1 周する間に、内側の \`for\` は最後まで（3 周）まわる`,
    hints: [
      "外側 `for ((i=1;i<=3;i++))`、内側 `for ((j=1;j<=3;j++))`",
      '`echo "$i x $j = $((i*j))"`',
    ],
  },
  initialCode: `for ((i=1;i<=3;i++)); do
  # ここに内側の for ループを書こう
done`,
  solutionCode: `for ((i=1;i<=3;i++)); do
  for ((j=1;j<=3;j++)); do
    echo "$i x $j = $((i*j))"
  done
done`,
});
