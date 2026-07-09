import { defineProblem } from "../../core/schemas";

export default defineProblem({
  id: "bash-jq-map-shape",
  stage: "write",
  language: "bash",
  scenario: "jq",
  copy: {
    title: "jq で形を変える（map）",
    prompt: `## やること

各ユーザーを **\`{ name, adult }\`** という形に作り替えた配列を出力しよう。
\`adult\` は「20歳以上なら true」。

入力例:

\`\`\`json
{ "users": [
  { "name": "Aki", "age": 20 },
  { "name": "Bo",  "age": 17 }
] }
\`\`\`

期待する出力（\`-c\` で 1 行の JSON）:

\`\`\`
[{"name":"Aki","adult":true},{"name":"Bo","adult":false}]
\`\`\`

## ヒント: map とオブジェクト構築

- **\`map(式)\`** は配列の各要素に式を適用する
- 新しいオブジェクトは \`{ name: .name, adult: (.age >= 20) }\` のように作る
- \`{name}\` は \`{name: .name}\` の省略形`,
    hints: [
      "`.users | map( ... )` で各要素を変換する",
      "各要素を `{name, adult: (.age >= 20)}` にする",
      "答えは `.users | map({name, adult: (.age >= 20)})`",
    ],
  },
  initialCode: `.users | map( )`,
  solutionCode: `.users | map({name, adult: (.age >= 20)})`,
});
