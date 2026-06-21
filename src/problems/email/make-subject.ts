import { defineProblem } from "../../core/schemas";

export default defineProblem({
  id: "write-email-make-subject",
  stage: "write",
  scenario: "email",
  copy: {
    title: "宛先名と日付からメール件名を生成する",
    prompt: `## やること

宛先の名前と日付を受け取って、**メール件名文字列を生成する**関数 \`solve\` を書こう。

\`\`\`ts
solve("田中", "2024/01/15")
// → "田中様 週次レポート（2024/01/15）"

solve("佐藤", "2024/02/01")
// → "佐藤様 週次レポート（2024/02/01）"
\`\`\`

## 書式

\`\${to}様 週次レポート（\${date}）\`

- 全角括弧 \`（）\` を使うこと（半角の \`()\` ではない）
- \`様\` の後は半角スペース

## テンプレートリテラル

バッククォートで囲んだ文字列の中では \`\${変数名}\` の形で変数を埋め込める。
これを使って、上の書式どおりに組み立てよう。`,
    hints: [
      "テンプレートリテラルを使う: バッククォートで囲んで `${変数}` で埋め込む",
      '全角括弧 `（）` を使うこと — `（${date}）` の形',
      '`return \\`${to}様 週次レポート（${date}）\\`` だけで完成',
    ],
  },
  initialCode: `function solve(to: string, date: string): string {
  // ここに書こう
}
`,
  solutionCode: `function solve(to: string, date: string): string {
  return \`\${to}様 週次レポート（\${date}）\`;
}
`,
});
