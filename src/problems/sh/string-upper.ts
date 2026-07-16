import { defineProblem } from "../../core/schemas";

export default defineProblem({
  id: "bash-sh-string-upper",
  stage: "write",
  language: "bash",
  scenario: "sh",
  copy: {
    title: "文字列を大文字にする",
    prompt: `## やること

標準入力から単語を 1 つ読み込み、**すべて大文字にして**出力するスクリプトを書こう。

入力例: \`hello\`
期待する出力: \`HELLO\`

## ヒント: パラメータ展開 \`\${var^^}\`

\`\`\`bash
read w
echo "\${w^^}"
\`\`\`

- **\`\${var^^}\`** は変数の中身をすべて大文字にして展開する
- 逆にすべて小文字にするには \`\${var,,}\` を使う`,
    hints: ["`read w` で読み込む", '`"${w^^}"` で大文字化'],
  },
  initialCode: `read w
# ここに echo を書こう`,
  solutionCode: `read w
echo "\${w^^}"`,
});
