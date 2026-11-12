import { defineProblem } from "../../../core/schemas";

export default defineProblem({
  id: "rust-fix-move-with-clone",
  stage: "write",
  language: "rust",
  scenario: "rust",
  copy: {
    title: "【エラーを直す】move した値を clone で使い続ける",
    prompt: `## やること

初期コードは **コンパイルエラー（E0382: use of moved value）** になる。直して正しく動くようにしよう。

関数 \`duplicate(s)\` は、受け取った文字列と **同じ内容の文字列を 2 つ** タプルで返したい。

\`\`\`rust
duplicate(String::from("hi"))   // ("hi", "hi")
\`\`\`

## なぜエラーになる？

\`\`\`rust
let t = s;   // ここで s の所有権が t に移動（move）する
(s, t)       // s はもう無効なので使えない
\`\`\`

\`String\` は Copy 型ではないので、代入すると所有権が移る。
2 つの独立した \`String\` がほしいなら、\`.clone()\` でヒープのデータごと複製する。`,
    hints: [
      "エラーメッセージの `value used here after move` の位置を確認しよう",
      "`let t = s.clone();` にする",
    ],
  },
  initialCode: `fn duplicate(s: String) -> (String, String) {
    let t = s;
    (s, t)
}
`,
  solutionCode: `fn duplicate(s: String) -> (String, String) {
    let t = s.clone();
    (s, t)
}
`,
});
