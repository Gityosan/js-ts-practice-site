import { defineProblem } from "../../core/schemas";

export default defineProblem({
  id: "fill-some-positive",
  stage: "write",
  scenario: "data",
  copy: {
    title: "条件を満たすデータがあるか調べる",
    prompt: `## やること

数値の配列を受け取って、**0 より大きい数が 1 つでもあれば \`true\`** を返す関数 \`solve\` を完成させよう。

\`\`\`ts
solve([1, -2, -3])   // → true  （1 が正）
solve([-1, -2, -3])  // → false （全部 0 以下）
solve([])            // → false （空）
\`\`\`

## ヒント: some の骨格

\`\`\`
配列.some( 要素 => 条件 )
\`\`\`

\`some\` は条件が **1 つでも** \`true\` なら \`true\` を返す。
全員が条件を満たすかは \`every\`（今回は使わなくてよい）。`,
    hints: [
      "`nums.some(n => n > 0)` — n が 0 より大きければ true",
      "`some` は最初に条件が true になった時点で即座に true を返す（全走査しない）",
      "空配列の `some` は `false` を返す（書かなくてもOK）",
    ],
  },
  initialCode: `function solve(nums: number[]): boolean {
  // ここに書こう

}`,
  solutionCode: `function solve(nums: number[]): boolean {
  return nums.some(n => n > 0);
}`,
});
