import { defineProblem } from "../../core/schemas";

export default defineProblem({
  id: "read-bash-repeat-count",
  stage: "read",
  language: "bash",
  scenario: "sh",
  copy: {
    title: "繰り返す回数を変えてみる",
    prompt: `## まず実行してみよう

**▶ 実行** を押すと、\`Hello!\` が 3 回表示される。

次に、コードの \`1 2 3\` を \`1 2 3 4 5\` にしたり \`1 2\` にしたりして、もう一度実行してみよう。
表示される回数が変わるはず。

## コードを読んでみよう

\`\`\`bash
for i in 1 2 3; do # ← ここの並びを変える
  echo "Hello!"
done
\`\`\`

- \`for i in 1 2 3\` — \`1 2 3\` を1つずつ変数 \`i\` に入れながら繰り返す
- \`do\` 〜 \`done\` — 繰り返す処理のまとまり（本体）

**\`1 2 3\` の並びだけ変えれば OK。**`,
    hints: [
      "`1 2 3` を好きな数の並びに変えてみよう（例: `1 2 3 4 5`）",
      "並びの個数がそのまま繰り返し回数になる",
      "`do` から `done` までが繰り返す処理",
    ],
  },
  initialCode: `for i in 1 2 3; do # ← ここの並びを変えてみよう
  echo "Hello!"
done`,
  solutionCode: `for i in 1 2 3; do
  echo "Hello!"
done`,
});
