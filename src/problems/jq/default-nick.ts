import { defineProblem } from "../../core/schemas";

export default defineProblem({
  id: "bash-jq-default-nick",
  stage: "write",
  language: "bash",
  scenario: "jq",
  copy: {
    title: "jq で既定値を使う（//）",
    prompt: `## やること

各ユーザーの **表示名** の配列を作ろう。\`nick\`（あだ名）があればそれを、無ければ \`name\` を使う。

入力例:

\`\`\`json
{ "users": [ { "name": "Aki", "nick": "A" }, { "name": "Bo" } ] }
\`\`\`

期待する出力（\`-c\`）:

\`\`\`
["A","Bo"]
\`\`\`

## ヒント: 代替演算子 //

- **\`a // b\`** は、\`a\` が null / false のとき \`b\` を使う
- \`.users | map(.nick // .name)\``,
    hints: [
      "`.users | map( ... )` で各要素を変換",
      "`.nick // .name` で「nick があればそれ、無ければ name」",
      "答えは `.users | map(.nick // .name)`",
    ],
  },
  initialCode: `.users | map( )`,
  solutionCode: `.users | map(.nick // .name)`,
});
