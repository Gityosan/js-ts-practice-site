import { defineProblem } from "../../core/schemas";

export default defineProblem({
  id: "bash-sh-line-count",
  stage: "write",
  language: "bash",
  scenario: "sh",
  copy: {
    title: "シェルで標準入力の行数を数える",
    prompt: `## やること

**標準入力から渡される行数**を数えて出力しよう。

入力（標準入力）:

\`\`\`
apple
banana
cherry
\`\`\`

期待する出力:

\`\`\`
3
\`\`\`

## ヒント: while read

- **\`while read -r line; do ... done\`** は標準入力を 1 行ずつ読む
- カウンタ変数を用意して、ループのたびに \`n=$((n + 1))\`
- 最後に \`echo "$n"\``,
    hints: [
      "カウンタを初期化: `n=0`",
      "`while read -r line; do n=$((n + 1)); done` で1行ずつ数える",
      '最後に `echo "$n"`',
    ],
  },
  initialCode: `n=0
while read -r line; do
  # ここで数える
done
echo "$n"`,
  solutionCode: `n=0
while read -r line; do
  n=$((n + 1))
done
echo "$n"`,
});
