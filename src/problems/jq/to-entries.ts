import { defineProblem } from "../../core/schemas";

export default defineProblem({
  id: "bash-jq-to-entries",
  stage: "write",
  language: "bash",
  scenario: "jq",
  copy: {
    title: "jq でキーと値を組にして表示する",
    prompt: `## やること

入力オブジェクトの各フィールドを \`キー=値\` の形で 1 行ずつ出力する jq フィルタを書こう。

入力例:

\`\`\`json
{ "a": 1, "b": 2 }
\`\`\`

期待する出力:

\`\`\`
a=1
b=2
\`\`\`

## ヒント: to_entries と文字列補間

\`\`\`
to_entries[] | "\\(.key)=\\(.value)"
\`\`\`

- **\`to_entries\`** はオブジェクトを \`{key, value}\` の配列に変換する
- **\`to_entries[]\`** で 1 要素ずつに展開
- **\`"\\(式)"\`** は文字列の中に jq の式を埋め込む文字列補間`,
    hints: [
      "`to_entries` で {key,value} の配列にする",
      "`to_entries[]` で1要素ずつに展開してから文字列補間",
    ],
  },
  initialCode: `to_entries`,
  solutionCode: `to_entries[] | "\\(.key)=\\(.value)"`,
});
