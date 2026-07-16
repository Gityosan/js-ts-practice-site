import { defineProblem } from "../../core/schemas";

export default defineProblem({
  id: "bash-sh-array-sum",
  stage: "write",
  language: "bash",
  scenario: "sh",
  copy: {
    title: "配列の合計を求める",
    prompt: `## やること

すでに宣言されている配列 \`nums\` の全要素を合計して出力するスクリプトを書こう。

## ヒント: 配列と for ループ

\`\`\`bash
nums=(3 1 4 1 5 9 2 6)
total=0
for n in "\${nums[@]}"; do
  total=$((total + n))
done
echo "$total"
\`\`\`

- **\`\${nums[@]}\`** で配列の全要素を展開できる
- \`for n in ...\` で 1 要素ずつ \`n\` に入れて処理する`,
    hints: [
      '`for n in "${nums[@]}"; do ... done` で全要素をまわす',
      "`total=$((total + n))` で足し込む",
      '最後に `echo "$total"`',
    ],
  },
  initialCode: `nums=(3 1 4 1 5 9 2 6)
total=0
# ここに for ループを書こう
echo "$total"`,
  solutionCode: `nums=(3 1 4 1 5 9 2 6)
total=0
for n in "\${nums[@]}"; do
  total=$((total + n))
done
echo "$total"`,
});
