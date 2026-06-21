import { defineProblem } from "../../core/schemas";

export default defineProblem({
  id: "write-average",
  stage: "write",
  scenario: "data",
  copy: {
    title: "平均値を計算しよう",
    prompt: `## やること

数値の配列を受け取って、その**平均値**を返す関数 \`solve\` を**白紙から**書こう。

\`\`\`ts
solve([10, 20, 30])  // → 20
solve([1, 2])        // → 1.5
solve([42])          // → 42
\`\`\`

空配列のときは \`0\` を返すこと。

## 考え方

平均 ＝ 合計 ÷ 個数。
これまで使ってきた \`reduce\` で合計を計算し、\`length\` で個数を割ればOK。`,
    hints: [
      "合計: `nums.reduce((acc, n) => acc + n, 0)`",
      "個数: `nums.length`",
      "空配列ガード: `if (nums.length === 0) return 0;`",
    ],
  },
  initialCode: `// 白紙から書いてみよう！
// function solve(nums: number[]): number { ... }
`,
  solutionCode: `function solve(nums: number[]): number {
  if (nums.length === 0) return 0;
  return nums.reduce((acc, n) => acc + n, 0) / nums.length;
}`,
});
