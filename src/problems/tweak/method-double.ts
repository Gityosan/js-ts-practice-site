import { defineProblem } from "../../core/schemas";

export default defineProblem({
  id: "tweak-method-double",
  stage: "tweak",
  scenario: "data",
  copy: {
    title: "キーワードを選んで関数を組み立てよう②",
    prompt: `## やること

各数値を **2倍** にした新しい配列を返したい。空欄に入る**メソッド名**を選ぼう。

\`\`\`
function solve(nums) {
  return nums.___(n => n * 2);
}
\`\`\`

\`\`\`ts
solve([1, 2, 3])  // → [2, 4, 6]
\`\`\`

## メソッドの使い分け

- \`map\` … 各要素を**変換**して同じ個数の配列を返す
- \`filter\` … 条件に合う要素**だけ**を残す（個数が減る）
- \`reduce\` … 全部を**1つの値**にまとめる

「個数はそのまま、中身を変える」なら、どれ？`,
    hints: [
      "個数は 3 個のまま、各要素を 2 倍に「変換」したい",
      "条件で絞るわけでも、1つにまとめるわけでもない",
      "答えは `map`",
    ],
  },
  tweak: {
    kind: "choice",
    template: `function solve(nums) {
  return nums.{{0}}(n => n * 2);
}`,
    blanks: [{ choices: ["map", "filter", "reduce"], answer: "map" }],
  },
  initialCode: `function solve(nums) {
  return nums.map(n => n * 2);
}`,
  solutionCode: `function solve(nums) {
  return nums.map(n => n * 2);
}`,
});
