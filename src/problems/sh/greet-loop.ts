import { defineProblem } from "../../core/schemas";

export default defineProblem({
  id: "bash-sh-greet-loop",
  stage: "write",
  language: "bash",
  scenario: "sh",
  copy: {
    title: "シェルで繰り返し出力する",
    prompt: `## やること

本物の **bash** がブラウザ内（WebAssembly）で動くよ。
1 から 3 までの数字を使って、次のように 3 行出力するシェルスクリプトを書こう。

期待する出力:

\`\`\`
Hello 1
Hello 2
Hello 3
\`\`\`

## ヒント: for ループ

\`\`\`bash
for i in 1 2 3; do
  echo "Hello $i"
done
\`\`\`

- **\`for i in ... ; do ... done\`** が繰り返しの基本形
- **\`$i\`** でループ変数の中身を展開
- **\`echo\`** は 1 行出力（末尾に改行）

書いたスクリプトは \`bash -c\` で実行され、標準出力が採点されるよ。`,
    hints: [
      "`for i in 1 2 3; do ... done` で 3 回まわる",
      '出力は `echo "Hello $i"`。ダブルクオートの中で `$i` が展開される',
      "seq を使わず `1 2 3` と直接並べてOK",
    ],
  },
  initialCode: `for i in 1 2 3; do
  # ここに echo を書こう
done`,
  solutionCode: `for i in 1 2 3; do
  echo "Hello $i"
done`,
});
