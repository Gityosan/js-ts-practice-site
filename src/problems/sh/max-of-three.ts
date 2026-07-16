import { defineProblem } from "../../core/schemas";

export default defineProblem({
  id: "bash-sh-max-of-three",
  stage: "write",
  language: "bash",
  scenario: "sh",
  copy: {
    title: "3 つの数の最大値を求める",
    prompt: `## やること

標準入力にスペース区切りで 3 つの数値が渡される。**最大値**を出力するスクリプトを書こう。

入力例: \`3 9 5\`
期待する出力: \`9\`

## ヒント: if / elif / else

\`\`\`bash
read a b c
if (( a >= b && a >= c )); then
  echo "$a"
elif (( b >= a && b >= c )); then
  echo "$b"
else
  echo "$c"
fi
\`\`\`

- **\`&&\`** は「かつ」。\`(( ))\` の中では \`&&\`/\`||\` がそのまま使える`,
    hints: [
      "`read a b c` で 3 つ読み込む",
      "`a` が `b` 以上 かつ `c` 以上なら `a` が最大",
      "`elif` で 2 番目の候補も判定する",
    ],
  },
  initialCode: `read a b c
# ここに if / elif / else を書こう`,
  solutionCode: `read a b c
if (( a >= b && a >= c )); then
  echo "$a"
elif (( b >= a && b >= c )); then
  echo "$b"
else
  echo "$c"
fi`,
});
