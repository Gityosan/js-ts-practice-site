import { defineProblem } from "../../core/schemas";

export default defineProblem({
  id: "bash-jq-keys",
  stage: "write",
  language: "bash",
  scenario: "jq",
  copy: {
    title: "jq でオブジェクトのキー一覧を取る",
    prompt: `## やること

入力オブジェクトの**キー一覧**を配列で出力する jq フィルタを書こう。

入力例:

\`\`\`json
{ "a": 1, "b": 2, "c": 3 }
\`\`\`

期待する出力: \`["a","b","c"]\`

## ヒント: keys

\`\`\`
keys
\`\`\`

- **\`keys\`** はオブジェクトのキーを**アルファベット順に並べた配列**で返す
- 採点は \`-c\`（コンパクト出力）付きなので配列が改行なしの 1 行で出る`,
    hints: ["`keys` だけで OK", "出力はアルファベット順に並ぶ"],
  },
  initialCode: `.`,
  solutionCode: `keys`,
});
