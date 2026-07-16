import { defineProblem } from "../../core/schemas";

export default defineProblem({
  id: "bash-jq-max-by-age",
  stage: "write",
  language: "bash",
  scenario: "jq",
  copy: {
    title: "jq で最年長を探す",
    prompt: `## やること

入力の \`users\` 配列から**最も年齢が大きいユーザーの名前**だけを出力する jq フィルタを書こう。

入力例:

\`\`\`json
{ "users": [
  { "name": "Bo", "age": 30 },
  { "name": "Aki", "age": 20 },
  { "name": "Cy", "age": 25 }
] }
\`\`\`

期待する出力: \`Bo\`

## ヒント: max_by

\`\`\`
.users | max_by(.age) | .name
\`\`\`

- **\`max_by(f)\`** は \`f\` の結果が最大になる要素**そのもの**（オブジェクト）を返す
- 返ってくるのは配列ではなく 1 個のオブジェクトなので、そのまま \`.name\` を続けられる`,
    hints: ["`max_by(.age)` は最大の要素（オブジェクト）を返す", "そのあと `.name` を続ける"],
  },
  initialCode: `.users`,
  solutionCode: `.users | max_by(.age) | .name`,
});
