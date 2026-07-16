import { defineProblem } from "../../core/schemas";

export default defineProblem({
  id: "bash-sh-string-length",
  stage: "write",
  language: "bash",
  scenario: "sh",
  copy: {
    title: "文字列の長さを求める",
    prompt: `## やること

標準入力から単語を 1 つ読み込み、その**文字数**を出力するスクリプトを書こう。

入力例: \`banana\`
期待する出力: \`6\`

## ヒント: パラメータ展開 \`\${#var}\`

\`\`\`bash
read w
echo "\${#w}"
\`\`\`

- **\`\${#var}\`** は変数の文字数（配列なら要素数）を返す`,
    hints: ["`read w` で読み込む", '`"${#w}"` が文字数'],
  },
  initialCode: `read w
# ここに echo を書こう`,
  solutionCode: `read w
echo "\${#w}"`,
});
