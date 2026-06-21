import { defineProblem } from "../../core/schemas";

export default defineProblem({
  id: "fill-sum-numbers",
  stage: "fill",
  scenario: "data",
  copy: {
    title: "合計を計算しよう①",
    prompt: `## やること

数値の配列を受け取って、その**合計**を返す関数 \`solve\` を完成させよう。

\`\`\`ts
solve([10, 20, 30])  // → 60
solve([])            // → 0
\`\`\`

## コードの骨格を読む

\`\`\`
function solve( nums: number[] ): number {
  ^^^^^^^^       ^^^^  ^^^^^^^^    ^^^^^^
  keyword        変数名  型注釈    戻り値の型
\`\`\`

**keyword** \`function\` が「関数を作る」を意味する。
**\`( )\`** の中が引数、**\`{ }\`** の中が処理。
型注釈の \`number[]\` は「数値の配列」という印。型は読むだけでOK！`,
    hints: [
      "配列の合計は `reduce` か `for` ループで計算できる",
      "`nums.reduce((acc, n) => acc + n, 0)` — acc は「今までの合計」",
      "配列が空のときは `0` を返す（reduce の第2引数が初期値になる）",
    ],
  },
  initialCode: `function solve(nums: number[]): number {
  // ここに書こう

}`,
  solutionCode: `function solve(nums: number[]): number {
  return nums.reduce((acc, n) => acc + n, 0);
}`,
});
