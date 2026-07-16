import { defineProblem } from "../../core/schemas";

export default defineProblem({
  id: "bash-sh-while-read-lines",
  stage: "write",
  language: "bash",
  scenario: "sh",
  copy: {
    title: "while read で複数行を処理する",
    prompt: `## やること

標準入力には**何行あるか分からない**行が渡される。各行の先頭に \`> \` を付けて出力するスクリプトを書こう。

入力例:

\`\`\`
apple
banana
cherry
\`\`\`

期待する出力:

\`\`\`
> apple
> banana
> cherry
\`\`\`

## ヒント: while read ループ

\`\`\`bash
while read -r line; do
  echo "> $line"
done
\`\`\`

- **\`while read -r line; do ... done\`** は入力が尽きる（EOF）まで 1 行ずつ読み続ける定番パターン
- \`-r\` を付けるとバックスラッシュがそのまま扱われる（習慣として付けておくと安全）`,
    hints: ["`while read -r line; do ... done` で行数を気にせず処理できる", '`echo "> $line"`'],
  },
  initialCode: `# while read ループを書こう`,
  solutionCode: `while read -r line; do
  echo "> $line"
done`,
});
