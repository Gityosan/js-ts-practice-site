import { defineProblem } from "../../core/schemas";

export default defineProblem({
  id: "bash-sh-positional-params",
  stage: "write",
  language: "bash",
  scenario: "sh",
  copy: {
    title: "位置パラメータを扱う",
    prompt: `## やること

このスクリプトはコマンドライン引数（位置パラメータ）を受け取って実行される。**引数の個数**を \`count: N\` の形で出力し、そのあと**引数を 1 つずつ**出力するスクリプトを書こう。

期待する出力（引数が apple banana cherry のとき）:

\`\`\`
count: 3
apple
banana
cherry
\`\`\`

## ヒント: \`$#\` と \`$@\`

\`\`\`bash
echo "count: $#"
for a in "$@"; do
  echo "$a"
done
\`\`\`

- **\`$#\`** は渡された引数の個数
- **\`"$@"\`** は各引数を個別の単語として展開する（\`for\` と組み合わせるのが定番）`,
    hints: ["`$#` が引数の個数", '`for a in "$@"; do echo "$a"; done` で1つずつ出力'],
  },
  initialCode: `# $# と $@ を使おう
echo "count: $#"`,
  solutionCode: `echo "count: $#"
for a in "$@"; do
  echo "$a"
done`,
});
