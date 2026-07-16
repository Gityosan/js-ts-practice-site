import { defineProblem } from "../../core/schemas";

export default defineProblem({
  id: "bash-sh-default-value",
  stage: "write",
  language: "bash",
  scenario: "sh",
  copy: {
    title: "デフォルト値を用意する",
    prompt: `## やること

標準入力から名前を 1 行読み込み \`Hello, <名前>!\` と出力する。ただし**何も入力がなかった場合**は \`Guest\` を使うようにしよう。

## ヒント: パラメータ展開のデフォルト値 \`\${var:-default}\`

\`\`\`bash
read name
echo "Hello, \${name:-Guest}!"
\`\`\`

- **\`\${var:-default}\`** は \`var\` が未設定または空文字のとき \`default\` を返す（\`var\` 自体は変更しない）`,
    hints: [
      "`read name` は入力が無いと `name` が空のままになる",
      '`"${name:-Guest}"` で空のときだけ Guest を使う',
    ],
  },
  initialCode: `read name
# ここに echo を書こう`,
  solutionCode: `read name
echo "Hello, \${name:-Guest}!"`,
});
