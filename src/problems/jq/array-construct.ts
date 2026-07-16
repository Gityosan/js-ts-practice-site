import { defineProblem } from "../../core/schemas";

export default defineProblem({
  id: "bash-jq-array-construct",
  stage: "write",
  language: "bash",
  scenario: "jq",
  copy: {
    title: "jq で新しい形のオブジェクトを作る",
    prompt: `## やること

入力の \`users\` 配列から、\`email\` を除いた **\`name\` と \`age\` だけを持つオブジェクトの配列**を作る jq フィルタを書こう。

入力例:

\`\`\`json
{ "users": [
  { "name": "Aki", "age": 20, "email": "a@x.com" },
  { "name": "Bo", "age": 30, "email": "b@x.com" }
] }
\`\`\`

期待する出力: \`[{"name":"Aki","age":20},{"name":"Bo","age":30}]\`

## ヒント: オブジェクト構築ショートハンド \`{name, age}\`

\`\`\`
.users | map({name, age})
\`\`\`

- **\`{name, age}\`** は \`{name: .name, age: .age}\` の省略形。同名フィールドだけ抜き出すときに便利
- \`map\` と組み合わせれば配列の各要素を新しい形に作り直せる`,
    hints: [
      "`{name, age}` は `{name: .name, age: .age}` の省略形",
      "`map({name, age})` で配列全体を作り直す",
    ],
  },
  initialCode: `.users`,
  solutionCode: `.users | map({name, age})`,
});
