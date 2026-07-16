import { defineProblem } from "../../core/schemas";

export default defineProblem({
  id: "bash-sh-sum-two",
  stage: "write",
  language: "bash",
  scenario: "sh",
  copy: {
    title: "2 つの数を合計する",
    prompt: `## やること

標準入力に **半角スペース区切りで 2 つの数値**が 1 行で渡される。合計を出力するスクリプトを書こう。

入力例: \`3 5\`
期待する出力: \`8\`

## ヒント: read は複数の変数に同時代入できる

\`\`\`bash
read a b
echo $((a + b))
\`\`\`

- **\`read a b\`** は 1 行をスペースで分割し、\`a\`・\`b\` にそれぞれ入れる
- **\`$(( ))\`** は算術式を展開して値にする（\`(( ))\`は判定、\`$(( ))\`は値を返す）`,
    hints: ["`read a b` で 2 つの変数に読み込む", "`echo $((a + b))` で合計を出力"],
  },
  initialCode: `read a b
# ここに echo を書こう`,
  solutionCode: `read a b
echo $((a + b))`,
});
