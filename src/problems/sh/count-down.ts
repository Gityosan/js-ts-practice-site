import { defineProblem } from "../../core/schemas";

export default defineProblem({
  id: "bash-sh-count-down",
  stage: "write",
  language: "bash",
  scenario: "sh",
  copy: {
    title: "while でカウントダウンする",
    prompt: `## やること

標準入力は使わない。**5 から 1 まで**を 1 行ずつ出力したあと、最後に \`Go!\` と出力するスクリプトを書こう。

期待する出力:

\`\`\`
5
4
3
2
1
Go!
\`\`\`

## ヒント: while ループ

\`\`\`bash
i=5
while [ $i -ge 1 ]; do
  echo $i
  i=$((i - 1))
done
echo "Go!"
\`\`\`

- **\`[ $i -ge 1 ]\`** は「\`i\` が 1 以上か」という条件（\`-ge\` = greater or equal）
- ループの中で \`i\` を 1 ずつ減らさないと無限ループになる`,
    hints: [
      "`i=5` から始めて `[ $i -ge 1 ]` の間だけ繰り返す",
      "毎回 `i=$((i - 1))` で減らす",
      'ループを抜けたあとに `echo "Go!"`',
    ],
  },
  initialCode: `i=5
# while ループを書こう
echo "Go!"`,
  solutionCode: `i=5
while [ $i -ge 1 ]; do
  echo $i
  i=$((i - 1))
done
echo "Go!"`,
});
