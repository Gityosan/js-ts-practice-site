import { defineProblem } from "../../core/schemas";

export default defineProblem({
  id: "write-max-value",
  stage: "write",
  scenario: "data",
  copy: {
    title: "最大値を見つける",
    prompt: `## やること

数値の配列から**最大値**を返す関数 \`solve\` を白紙から書こう。

\`\`\`ts
solve([3, 1, 4, 1, 5, 9, 2, 6])  // → 9
solve([-1, -5, -2])               // → -1
solve([42])                        // → 42
\`\`\`

配列には必ず 1 つ以上の要素がある前提。

## アプローチのヒント

やり方は1つじゃない。例えば…

- \`Math.max\` に配列を**スプレッド**で渡す
- \`reduce\` で先頭から**大きい方を1つずつ残す**

どちらでも正解。振る舞いが合えばOK。`,
    hints: [
      "`Math.max(...nums)` でスプレッド展開して最大値を一発で取れる",
      "`reduce((max, n) => n > max ? n : max, nums[0])` でも同じ結果",
      "関数の骨格: `function solve(nums: number[]): number { return ...; }`",
    ],
  },
  initialCode: `// 白紙から書いてみよう！
// function solve(nums: number[]): number { ... }
`,
  solutionCode: `function solve(nums: number[]): number {
  return Math.max(...nums);
}`,
});
