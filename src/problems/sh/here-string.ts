import { defineProblem } from "../../core/schemas";

export default defineProblem({
  id: "bash-sh-here-string",
  stage: "write",
  language: "bash",
  scenario: "sh",
  copy: {
    title: "here-string で変数を read に渡す",
    prompt: `## やること

変数 \`data\` に入っている \`"10 20 30"\` を、**標準入力を使わずに** \`read\` で 3 つの変数へ分解し、合計を出力するスクリプトを書こう。

## ヒント: here-string \`<<<\`

\`\`\`bash
data="10 20 30"
read a b c <<< "$data"
echo $((a + b + c))
\`\`\`

- **\`command <<< "$var"\`** は変数の中身をその場でコマンドの標準入力として渡す（here-string）
- パイプ \`echo "$data" | read a b c\` と似ているが、\`<<<\` はサブシェルを作らないので \`read\` した変数がそのまま使い続けられる`,
    hints: ['`read a b c <<< "$data"` で data を3つに分解', "`echo $((a + b + c))`"],
  },
  initialCode: `data="10 20 30"
# ここに here-string で read しよう`,
  solutionCode: `data="10 20 30"
read a b c <<< "$data"
echo $((a + b + c))`,
});
