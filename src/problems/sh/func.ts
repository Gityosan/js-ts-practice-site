import { defineProblem } from "../../core/schemas";

export default defineProblem({
  id: "bash-sh-func",
  stage: "write",
  language: "bash",
  scenario: "sh",
  copy: {
    title: "シェルで関数を定義する",
    prompt: `## やること

**\`greet\` という関数**を定義して、\`Aki\` と \`Bo\` に挨拶しよう。
関数は引数 \`$1\` を受け取り、\`Hi, 名前\` と出力する。

期待する出力:

\`\`\`
Hi, Aki
Hi, Bo
\`\`\`

## ヒント: 関数定義

\`\`\`bash
greet() {
  echo "Hi, $1"
}
greet Aki
greet Bo
\`\`\`

- \`名前() { ... }\` で関数を定義。中では \`$1\` \`$2\` … が引数
- 呼び出しは \`greet Aki\` のようにスペース区切り`,
    hints: [
      '`greet() { echo "Hi, $1"; }` で定義',
      "`$1` が1つ目の引数",
      "`greet Aki` と `greet Bo` を呼ぶ",
    ],
  },
  initialCode: `greet() {
  # $1 を使って挨拶する
}
greet Aki
greet Bo`,
  solutionCode: `greet() {
  echo "Hi, $1"
}
greet Aki
greet Bo`,
});
