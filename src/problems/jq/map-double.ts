import { defineProblem } from "../../core/schemas";

export default defineProblem({
  id: "bash-jq-map-double",
  stage: "write",
  language: "bash",
  scenario: "jq",
  copy: {
    title: "jq で配列の各要素を加工する",
    prompt: `## やること

入力の \`nums\` 配列の**各要素を 2 倍**にして、1 行ずつ出力する jq フィルタを書こう。

入力例:

\`\`\`json
{ "nums": [1, 2, 3] }
\`\`\`

期待する出力:

\`\`\`
2
4
6
\`\`\`

## ヒント: map

\`\`\`
.nums | map(. * 2) | .[]
\`\`\`

- **\`map(f)\`** は配列の各要素に \`f\` を適用した新しい配列を返す
- \`map\` の中の **\`.\`** は「今処理している要素そのもの」を指す
- 最後の **\`.[]\`** で配列を 1 要素ずつの出力に展開する`,
    hints: [
      "`map(. * 2)` で各要素を2倍にした配列を作る",
      "配列のままだと1行にまとまるので `| .[]` で展開する",
    ],
  },
  initialCode: `.nums`,
  solutionCode: `.nums | map(. * 2) | .[]`,
});
