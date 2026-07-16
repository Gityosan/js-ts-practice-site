import { defineProblem } from "../../core/schemas";

export default defineProblem({
  id: "read-bash-greet-name",
  stage: "read",
  language: "bash",
  scenario: "sh",
  copy: {
    title: "名前を変えて挨拶を出力する",
    prompt: `## まず実行してみよう

**▶ 実行** を押すと、挨拶メッセージが表示される。

次に、コードの \`"Taro"\` を自分の名前（またはなんでも）に変えてもう一度実行しよう。

## コードを読んでみよう

\`\`\`bash
name="Taro" # 名前を変数に入れている

echo "Hi, $name!"
\`\`\`

- \`name="Taro"\` — 文字列を変数 \`name\` に入れる（bash では \`=\` の前後にスペースを入れない）
- \`"$name"\`（ダブルクォートの中） — \`$\` を付けると変数の中身が展開される

**\`"Taro"\` のところだけ変えれば OK。**`,
    hints: [
      '`"Taro"` を `"自分の名前"` に変えてみよう',
      "スペースや記号も OK",
      "ダブルクォートの中では `$name` が中身に展開される",
    ],
  },
  initialCode: `name="Taro" # ← ここを変えてみよう

echo "Hi, $name!"`,
  solutionCode: `name="Taro"

echo "Hi, $name!"`,
});
