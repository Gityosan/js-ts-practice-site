import { defineProblem } from "../../core/schemas";

export default defineProblem({
  id: "fill-filter-evens",
  stage: "fill",
  scenario: "data",
  copy: {
    title: "条件でデータを絞り込む",
    prompt: `## やること

数値の配列から**偶数だけ**を取り出す関数 \`solve\` を完成させよう。

\`\`\`ts
solve([1, 2, 3, 4, 5])  // → [2, 4]
solve([1, 3, 5])         // → []
\`\`\`

## 骨格を読む

\`\`\`
function solve( nums: number[] ): number[] {
\`\`\`

戻り値の型が \`number[]\`（配列）に変わった。
\`if (n % 2 === 0)\` で偶数判定できる（\`%\` は余り）。`,
    hints: [
      "`filter` メソッドを使うと「条件に合う要素だけ残す」ができる",
      "`nums.filter(n => n % 2 === 0)` — `n % 2 === 0` が偶数の条件",
      "または `for` ループで新しい配列を作って `push` してもOK",
    ],
  },
  initialCode: `function solve(nums: number[]): number[] {
  // ここに書こう

}`,
  solutionCode: `function solve(nums: number[]): number[] {
  return nums.filter(n => n % 2 === 0);
}`,
});
