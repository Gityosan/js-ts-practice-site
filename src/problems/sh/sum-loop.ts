import { defineProblem } from "../../core/schemas";

export default defineProblem({
  id: "bash-sh-sum-loop",
  stage: "write",
  language: "bash",
  scenario: "sh",
  copy: {
    title: "シェルで合計を計算する",
    prompt: `## やること

1 から 5 までの数字を全部足した **合計（15）** を出力するシェルスクリプトを書こう。

期待する出力:

\`\`\`
15
\`\`\`

## ヒント: 変数と算術展開

- 変数に足していく: **\`s=$((s + i))\`**（\`$(( ))\` は算術計算）
- \`for i in 1 2 3 4 5; do ... done\` でまわす
- 最後に **\`echo "$s"\`** で表示`,
    hints: [
      "合計用の変数を 0 で初期化: `s=0`",
      "ループの中で `s=$((s + i))`",
      '最後に `echo "$s"` で出力する',
    ],
  },
  initialCode: `s=0
for i in 1 2 3 4 5; do
  # ここで s に足していく
done
echo "$s"`,
  solutionCode: `s=0
for i in 1 2 3 4 5; do
  s=$((s + i))
done
echo "$s"`,
});
