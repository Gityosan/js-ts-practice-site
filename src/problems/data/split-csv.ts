import { defineProblem } from "../../core/schemas";

export default defineProblem({
  id: "fill-split-csv",
  stage: "fill",
  scenario: "data",
  copy: {
    title: "データを配列に変換する",
    prompt: `## やること

カンマ区切りの文字列（CSV の 1 行）を受け取って、**各値をトリム（前後の空白を除いた）した配列**を返す関数 \`solve\` を完成させよう。

\`\`\`ts
solve("Alice, Bob,  Charlie")
// → ["Alice", "Bob", "Charlie"]
\`\`\`

## ヒント

\`\`\`
"Alice, Bob".split(",")      // → ["Alice", " Bob"]（空白が残る）
" Bob".trim()                // → "Bob"
\`\`\`

\`split\` で分割 → \`map\` でトリム、の 2 ステップ。`,
    hints: [
      "`line.split(',')` でカンマで分割できる",
      "`.map(s => s.trim())` で各要素の前後空白を消せる",
      "チェーンで書くと `line.split(',').map(s => s.trim())`",
    ],
  },
  initialCode: `function solve(line: string): string[] {
  // ここに書こう

}`,
  solutionCode: `function solve(line: string): string[] {
  return line.split(',').map(s => s.trim());
}`,
});
