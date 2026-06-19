import { defineProblem } from "../../core/schemas";

export default defineProblem({
  id: "write-unique",
  stage: "write",
  scenario: "data",
  copy: {
    title: "重複を取り除こう（白紙から）",
    prompt: `## やること

数値の配列から**重複を除いたユニークな配列**を返す関数 \`solve\` を白紙から書こう。
**順序は元の配列の最初の出現順**を保つこと。

\`\`\`ts
solve([1, 2, 2, 3, 1])  // → [1, 2, 3]
solve([5, 5, 5])         // → [5]
solve([1, 2, 3])         // → [1, 2, 3]（もともと重複なし）
solve([])                // → []
\`\`\`

## アプローチのヒント

**Set を使う方法**（最短）:
\`\`\`ts
[...new Set(nums)]   // Set は重複を自動除去、スプレッドで配列化
\`\`\`

**filter を使う方法**（インデックス活用）:
\`\`\`ts
nums.filter((n, i) => nums.indexOf(n) === i)  // 初回登場のもののみ残す
\`\`\``,
    hints: [
      "`new Set(nums)` で重複が消え、`[...new Set(nums)]` で配列に戻せる",
      "`nums.indexOf(n) === i` で「今見ている n が初めて出てくるインデックスか」を判定できる",
      "関数の骨格: `function solve(nums: number[]): number[] { return ...; }`",
    ],
  },
  initialCode: `// 白紙から書いてみよう！
// function solve(nums: number[]): number[] { ... }
`,
  solutionCode: `function solve(nums: number[]): number[] {
  return [...new Set(nums)];
}`,
});
