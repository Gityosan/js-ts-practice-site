import { defineProblem } from "../../core/schemas";

export default defineProblem({
  id: "read-star-count",
  stage: "read",
  scenario: "data",
  copy: {
    title: "数字を変えて★を増やそう",
    prompt: `## まず実行してみよう

右の **▶ 実行** を押してみよう。★ が表示される！

次に、コードの \`5\` を好きな数字（1〜20）に変えてもう一度実行。
★ の数が変わるはず。

\`\`\`
function solve(): number {
  return 5;  // ← ここの数字を変える
}
\`\`\`

## コードを読んでみよう

- \`function\` — 関数を作るキーワード
- \`solve\` — 関数の名前（open-class：自分でつけた名前）
- \`(): number\` — 引数なし、数値を返す
- \`return 5\` — 5 を返す

**数字（\`5\`）だけ変えれば OK。それ以外は触らなくていい。**`,
    hints: [
      "1〜20 の好きな数字に変えてみよう",
      "`return` の後ろの数字だけ変えればOK",
      "0 や 20 を超えると ★ が少なくなるかも？",
    ],
  },
  initialCode: `function solve(): number {
  return 5; // ← この数字を変えて ▶ 実行！
}`,
  solutionCode: `function solve(): number {
  return 5;
}`,
});
