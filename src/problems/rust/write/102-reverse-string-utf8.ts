import { defineProblem } from "../../../core/schemas";

export default defineProblem({
  id: "rust-reverse-string-utf8",
  stage: "write",
  language: "rust",
  scenario: "rust",
  copy: {
    title: "文字列を反転する（マルチバイト対応）",
    prompt: `## やること

文字列を **文字単位で** 逆順にした \`String\` を返す関数 \`reverse\` を書こう。日本語などのマルチバイト文字が含まれていても正しく反転すること。

\`\`\`rust
reverse("hello")        // "olleh"
reverse("こんにちは")    // "はちにんこ"
reverse("aé日")         // "日éa"
reverse("")             // ""
\`\`\`

## ポイント

- \`s.chars()\` は文字（char）を先頭から順に返すイテレータ
- \`.rev()\` で逆順にできる
- \`.collect::<String>()\`（または戻り値の型から推論させて \`.collect()\`）で String に集める
- **バイト単位（\`bytes()\`）で反転すると UTF-8 が壊れる** ので必ず \`chars()\` を使う

ループで書くなら: 空の String を作り、\`chars().rev()\` で取り出した文字を \`push\` していく。`,
    hints: [
      "`s.chars().rev()`",
      "`s.chars().rev().collect()`（戻り値が String なので型は推論される）",
    ],
  },
  initialCode: `fn reverse(s: &str) -> String {
    todo!()
}
`,
  solutionCode: `fn reverse(s: &str) -> String {
    s.chars().rev().collect()
}
`,
});
