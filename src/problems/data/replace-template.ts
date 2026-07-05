import { defineProblem } from "../../core/schemas";

export default defineProblem({
  id: "fill-replace-template",
  stage: "write",
  scenario: "data",
  copy: {
    title: "文字列を置き換える",
    prompt: `## やること

文字列テンプレート中の \`{{name}}\` を実際の名前に置き換える関数 \`solve\` を完成させよう。

\`\`\`ts
solve("こんにちは、{{name}}さん！", "Alice")
// → "こんにちは、Aliceさん！"
\`\`\`

## ヒント: replace の骨格

\`\`\`
文字列.replace(検索対象, 置き換え先)
\`\`\`

\`"{{name}}"\` という文字列を \`name\` に置き換えるだけ。`,
    hints: [
      '`template.replace("{{name}}", name)` — 最初の一致だけ置き換える',
      "正規表現 `/\\{\\{name\\}\\}/g` を使うと複数箇所を一度に置き換えられる",
      "g フラグ（global）を付けると「全部置き換え」になる",
    ],
  },
  initialCode: `function solve(template: string, name: string): string {
  // ここに書こう

}`,
  solutionCode: `function solve(template: string, name: string): string {
  return template.replace(/{{name}}/g, name);
}`,
});
