import { defineProblem } from "../../core/schemas";

export default defineProblem({
  id: "tweak-parsons-filter",
  stage: "tweak",
  scenario: "data",
  copy: {
    title: "バラバラの行を正しい順に並べよう",
    prompt: `## やること

行がバラバラになっている。**ドラッグして正しい順番**に並べ替え、偶数だけを取り出す関数を完成させよう。

\`\`\`ts
solve([1, 2, 3, 4, 5])  // → [2, 4]
\`\`\`

## 並べ替えの骨格を読む

プログラムは**上から順に**実行される。骨格はいつもこの形:

\`\`\`
function 名前(引数) {   ← まず関数の入り口
  〜処理〜              ← 中で計算
  return 結果           ← 答えを返す
}                       ← 閉じカッコで終わり
\`\`\`

\`{\` で始まったら、対応する \`}\` で閉じる。`,
    hints: [
      "1行目は必ず `function solve(nums) {`（関数の入り口）",
      "`const evens = ...` で偶数を絞り、その次に `return evens;`",
      "最後の `}` は関数全体を閉じる",
    ],
  },
  tweak: {
    kind: "parsons",
    lines: [
      "function solve(nums) {",
      "  const evens = nums.filter(n => n % 2 === 0);",
      "  return evens;",
      "}",
    ],
  },
  initialCode: `function solve(nums) {
  const evens = nums.filter(n => n % 2 === 0);
  return evens;
}`,
  solutionCode: `function solve(nums) {
  const evens = nums.filter(n => n % 2 === 0);
  return evens;
}`,
});
