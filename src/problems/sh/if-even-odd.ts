import { defineProblem } from "../../core/schemas";

export default defineProblem({
  id: "bash-sh-if-even-odd",
  stage: "write",
  language: "bash",
  scenario: "sh",
  copy: {
    title: "if で偶数・奇数を判定する",
    prompt: `## やること

標準入力から数値を 1 つ読み込み、**偶数なら \`even\`、奇数なら \`odd\`** と出力するスクリプトを書こう。

## ヒント: read と算術式 \`(( ))\`

\`\`\`bash
read n
if (( n % 2 == 0 )); then
  echo "even"
else
  echo "odd"
fi
\`\`\`

- **\`read n\`** で標準入力の 1 行を変数 \`n\` に読み込む
- **\`(( ))\`** の中では \`$\` なしで変数を算術式として使える
- **\`%\`** は剰余（あまり）演算子`,
    hints: [
      "`read n` で 1 行読み込む",
      "`(( n % 2 == 0 ))` が真なら偶数",
      "`if ...; then ...; else ...; fi` の形",
    ],
  },
  initialCode: `read n
# ここに if を書こう`,
  solutionCode: `read n
if (( n % 2 == 0 )); then
  echo "even"
else
  echo "odd"
fi`,
});
