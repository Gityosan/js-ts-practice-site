import { defineProblem } from "../../core/schemas";

export default defineProblem({
  id: "read-progress",
  stage: "read",
  scenario: "data",
  copy: {
    title: "数字を変えてプログレスバーを動かそう",
    prompt: `## まず実行してみよう

**▶ 実行** を押すと、プログレスバーが表示される。

次に \`60\` を \`0\` 〜 \`100\` の好きな数字に変えて、バーの長さが変わるのを確認しよう。

## コードを読んでみよう

\`\`\`ts
function solve(): number {
  return 60; // 0〜100 の数字
}
\`\`\`

- \`function solve()\` — \`solve\` という名前の関数
- \`: number\` — この関数は**数値**を返す、という型注釈
- \`return 60\` — 60 を返す

## 型注釈とは？

\`: number\` の部分は **TypeScript の型注釈**。
「この関数は数値（number）を返す」という設計図。
実際の動作には影響しないが、間違いを早めに教えてくれる。

**\`60\` を好きな数字に変えてみよう（0〜100）。**`,
    hints: [
      "0〜100 の整数に変えると、バーの長さが変わる",
      "0 にすると空のバー、100 にすると満タンになる",
      "小数（例: 33.5）でもOK",
    ],
  },
  initialCode: `function solve(): number {
  return 60; // ← 0〜100 の数字に変えてみよう
}`,
  solutionCode: `function solve(): number {
  return 60;
}`,
});
