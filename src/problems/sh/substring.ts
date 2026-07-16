import { defineProblem } from "../../core/schemas";

export default defineProblem({
  id: "bash-sh-substring",
  stage: "write",
  language: "bash",
  scenario: "sh",
  copy: {
    title: "部分文字列を取り出す",
    prompt: `## やること

標準入力から単語を 1 つ読み込み、**先頭 3 文字**だけを出力するスクリプトを書こう（3 文字未満ならあるだけ出力される）。

入力例: \`banana\`
期待する出力: \`ban\`

## ヒント: \`\${var:offset:length}\`

\`\`\`bash
read w
echo "\${w:0:3}"
\`\`\`

- **\`\${var:offset:length}\`** は \`offset\` 文字目から \`length\` 文字分を取り出す（0 始まり）`,
    hints: ["`read w` で読み込む", '`"${w:0:3}"` が先頭3文字'],
  },
  initialCode: `read w
# ここに echo を書こう`,
  solutionCode: `read w
echo "\${w:0:3}"`,
});
