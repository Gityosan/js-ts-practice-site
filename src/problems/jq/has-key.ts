import { defineProblem } from "../../core/schemas";

export default defineProblem({
  id: "bash-jq-has-key",
  stage: "write",
  language: "bash",
  scenario: "jq",
  copy: {
    title: "jq でキーの存在を確認する",
    prompt: `## やること

入力オブジェクトが \`age\` というキーを**持っているかどうか**を \`true\`/\`false\` で出力する jq フィルタを書こう。

入力例:

\`\`\`json
{ "name": "Aki", "age": 20 }
\`\`\`

期待する出力: \`true\`

## ヒント: has

\`\`\`
has("age")
\`\`\`

- **\`has("key")\`** はオブジェクトがそのキーを持つか（配列ならそのインデックスがあるか）を真偽値で返す`,
    hints: ['`has("age")` がそのまま答え'],
  },
  initialCode: `.`,
  solutionCode: `has("age")`,
});
