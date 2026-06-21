import { defineProblem } from "../../core/schemas";

export default defineProblem({
  id: "fill-map-double",
  stage: "fill",
  scenario: "data",
  copy: {
    title: "全部を2倍にしよう",
    prompt: `## やること

数値の配列を受け取り、**それぞれの値を2倍にした配列**を返す関数 \`solve\` を完成させよう。

\`\`\`ts
solve([10, 20, 30])  // → [20, 40, 60]
solve([])            // → []
\`\`\`

## ビジネスの文脈

あなたはデータエンジニア。全社員の月給リストを受け取り、
ボーナス月（2倍）のリストを返すバッチを書いている。`,
    hints: [
      "`map` メソッドは「各要素を変換した新しい配列を返す」",
      "`nums.map(n => n * 2)` — `n => n * 2` が「1個の数値を受け取って2倍にする」関数",
      "元の配列は変わらない。`map` は新しい配列を作る",
    ],
  },
  initialCode: `function solve(nums: number[]): number[] {
  // ここに書こう

}`,
  solutionCode: `function solve(nums: number[]): number[] {
  return nums.map(n => n * 2);
}`,
});
