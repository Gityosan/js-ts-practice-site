import { defineProblem } from "../../core/schemas";

export default defineProblem({
  id: "bash-sh-reverse-string",
  stage: "write",
  language: "bash",
  scenario: "sh",
  copy: {
    title: "文字列を逆順にする",
    prompt: `## やること

標準入力から単語を 1 つ読み込み、**文字の並びを逆にして**出力するスクリプトを書こう（\`rev\` コマンドは使わない）。

入力例: \`hello\`
期待する出力: \`olleh\`

## ヒント: 部分文字列 \`\${var:offset:length}\`

\`\`\`bash
read w
len=\${#w}
rev=""
for (( i = len - 1; i >= 0; i-- )); do
  rev="$rev\${w:i:1}"
done
echo "$rev"
\`\`\`

- **\`\${w:i:1}\`** は \`w\` の \`i\` 文字目から 1 文字だけ取り出す
- 後ろから 1 文字ずつ \`rev\` に足していけば逆順になる`,
    hints: [
      "`${#w}` で長さを取り、`len - 1` から `0` まで逆にまわす",
      "`${w:i:1}` で i 文字目を 1 文字取り出せる",
      "取り出した文字を `rev` の**末尾**に足していく",
    ],
  },
  initialCode: `read w
len=\${#w}
rev=""
# ここに for ループを書こう
echo "$rev"`,
  solutionCode: `read w
len=\${#w}
rev=""
for (( i = len - 1; i >= 0; i-- )); do
  rev="$rev\${w:i:1}"
done
echo "$rev"`,
});
