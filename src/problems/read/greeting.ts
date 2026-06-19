import { defineProblem } from "../../core/schemas";

export default defineProblem({
  id: "read-greeting",
  stage: "read",
  scenario: "data",
  copy: {
    title: "名前を変えて挨拶を返そう",
    prompt: `## まず実行してみよう

**▶ 実行** を押すと、挨拶メッセージが表示される。

次に、コードの \`"田中"\` を自分の名前（またはなんでも）に変えてもう一度実行しよう。

## コードを読んでみよう

\`\`\`ts
const name = "田中"; // 名前を変数に入れている

function solve(): string {
  return \`\${name}さん、こんにちは！\`;
}
\`\`\`

- \`const name = "田中"\` — 文字列を変数に入れる
- `` \`...\` `` — **テンプレートリテラル**（バッククォートで囲む）
- \`\${name}\` — テンプレートリテラルの中で変数を展開できる

**\`"田中"\` のところだけ変えれば OK。**`,
    hints: [
      '`"田中"` を `"自分の名前"` に変えてみよう',
      "スペースや記号も OK — 文字列は何でも入れられる",
      "バッククォートと `${}` の組み合わせが「テンプレートリテラル」",
    ],
  },
  initialCode: `const name = "田中"; // ← ここを変えてみよう

function solve(): string {
  return \`\${name}さん、こんにちは！\`;
}`,
  solutionCode: `const name = "田中";

function solve(): string {
  return \`\${name}さん、こんにちは！\`;
}`,
});
