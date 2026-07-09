import { defineProblem } from "../../core/schemas";

export default defineProblem({
  id: "bash-sh-even-odd",
  stage: "write",
  language: "bash",
  scenario: "sh",
  copy: {
    title: "シェルで条件分岐する（if）",
    prompt: `## やること

1 から 4 まで、それぞれが **偶数(even)か奇数(odd)か** を出力しよう。

期待する出力:

\`\`\`
1: odd
2: even
3: odd
4: even
\`\`\`

## ヒント: if と test

- 2 で割った余り: **\`$((i % 2))\`**
- 比較は **\`[ $((i % 2)) -eq 0 ]\`**（\`-eq\` は「等しい」。角括弧の内側は空白が必要）
- 形は \`if [ 条件 ]; then ... else ... fi\``,
    hints: [
      "`for i in 1 2 3 4; do ... done` でまわす",
      '`if [ $((i % 2)) -eq 0 ]; then echo "$i: even"; else echo "$i: odd"; fi`',
      "角括弧 `[ ]` の内側は前後に空白が要る",
    ],
  },
  initialCode: `for i in 1 2 3 4; do
  # even か odd かを出力
done`,
  solutionCode: `for i in 1 2 3 4; do
  if [ $((i % 2)) -eq 0 ]; then
    echo "$i: even"
  else
    echo "$i: odd"
  fi
done`,
});
