import { defineProblem } from "../../core/schemas";

export default defineProblem({
  id: "read-color-box",
  stage: "read",
  scenario: "data",
  copy: {
    title: "色の名前を返してボックスを塗ろう",
    prompt: `## まず実行してみよう

**▶ 実行** を押すと、青いボックスが表示される。

次に \`"blue"\` を別の色の名前に変えて、ボックスの色が変わるのを確認しよう。

## コードを読んでみよう

\`\`\`ts
function solve(): string {
  return "blue"; // ← 色の名前を文字列で返す
}
\`\`\`

- \`function solve(): string\` — **文字列（string）** を返す関数
- \`return "blue"\` — \`"blue"\` という文字列を返す

## 試せる色の名前

\`\`\`
"red"    "green"   "blue"   "orange"
"purple" "tomato"  "coral"  "gold"
"pink"   "skyblue" "navy"   "teal"
\`\`\`

CSS で使える色の名前ならなんでも OK！`,
    hints: [
      '`"blue"` のダブルクォートの中だけを変える',
      '"red", "green", "orange" など英語の色名が使える',
      '"tomato", "coral", "gold" のような色名も CSS で使える',
    ],
  },
  initialCode: `function solve(): string {
  return "blue"; // ← 色の名前を変えてみよう
}`,
  solutionCode: `function solve(): string {
  return "blue";
}`,
});
