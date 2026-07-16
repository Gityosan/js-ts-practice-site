import { defineProblem } from "../../core/schemas";

export default defineProblem({
  id: "bash-sh-function-greet",
  stage: "write",
  language: "bash",
  scenario: "sh",
  copy: {
    title: "関数を定義して挨拶する",
    prompt: `## やること

引数を 1 つ受け取り \`Hi, <名前>!\` と出力する関数 \`greet\` を定義し、\`Aki\`・\`Bo\`・\`Cy\` の 3 人分呼び出そう。

期待する出力:

\`\`\`
Hi, Aki!
Hi, Bo!
Hi, Cy!
\`\`\`

## ヒント: 関数定義と \`$1\`

\`\`\`bash
greet() {
  echo "Hi, $1!"
}
greet "Aki"
greet "Bo"
greet "Cy"
\`\`\`

- **\`name() { ... }\`** で関数を定義できる
- 関数内では \`$1\` が「呼び出し時の 1 番目の引数」になる`,
    hints: [
      "`greet() { ... }` の中で `$1` を使う",
      '`echo "Hi, $1!"`',
      '定義したあとに `greet "Aki"` のように 3 回呼び出す',
    ],
  },
  initialCode: `greet() {
  # ここに echo を書こう
}
greet "Aki"
greet "Bo"
greet "Cy"`,
  solutionCode: `greet() {
  echo "Hi, $1!"
}
greet "Aki"
greet "Bo"
greet "Cy"`,
});
