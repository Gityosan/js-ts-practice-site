import { defineProblem } from "../../core/schemas";

export default defineProblem({
  id: "tweak-keyword-sum",
  stage: "tweak",
  scenario: "data",
  copy: {
    title: "キーワードを選んで関数を組み立てる①",
    prompt: `## やること

空欄に入る**キーワード**を選んで、合計を計算する関数を完成させよう。

\`\`\`
___ solve(nums) {        ← 関数を作るキーワード
  ___ (nums.length === 0) {  ← 「もし〜なら」の条件
    return 0;
  }
  return nums.reduce((acc, n) => acc + n, 0);
}
\`\`\`

## ヒント: キーワードが括弧の意味を決める

同じ \`( )\` でも、**直前のキーワード**で意味が変わる:
- \`function solve( ... )\` → \`( )\` は**引数**
- \`if ( ... )\` → \`( )\` は**条件**（true / false）

「手前のキーワードを見れば括弧の役割がわかる」がこのステージのコツ。`,
    hints: [
      "1つ目: `solve(nums) { ... }` は関数の定義。関数を作るキーワードは？",
      "2つ目: `(nums.length === 0)` は条件式。「もし〜なら」を表すキーワードは？",
      "`function` の後ろの ( ) は引数、`if` の後ろの ( ) は条件",
    ],
  },
  tweak: {
    kind: "choice",
    template: `{{0}} solve(nums) {
  {{1}} (nums.length === 0) {
    return 0;
  }
  return nums.reduce((acc, n) => acc + n, 0);
}`,
    blanks: [
      { choices: ["function", "const", "return"], answer: "function" },
      { choices: ["if", "for", "while"], answer: "if" },
    ],
  },
  initialCode: `function solve(nums) {
  if (nums.length === 0) {
    return 0;
  }
  return nums.reduce((acc, n) => acc + n, 0);
}`,
  solutionCode: `function solve(nums) {
  if (nums.length === 0) {
    return 0;
  }
  return nums.reduce((acc, n) => acc + n, 0);
}`,
});
