import { defineProblem } from "../../../core/schemas";

export default defineProblem({
  id: "rust-lifetime-longest",
  stage: "write",
  language: "rust",
  scenario: "rust",
  copy: {
    title: "longest<'a> を書く",
    prompt: `## やること

2 つの文字列スライスのうち **長いほう** を返す関数 \`longest\` を書こう（同じ長さなら \`a\`）。

\`\`\`rust
longest("apple", "fig")   // "apple"
longest("hi", "yo")       // "hi"
\`\`\`

戻り値は a か b の **どちらかを指す参照** なので、ライフタイム注釈が必要。

\`\`\`rust
fn longest<'a>(a: &'a str, b: &'a str) -> &'a str
\`\`\`

「戻り値は a と b の両方が有効な間だけ有効」という意味になる。

長さは \`.len()\`（バイト数）で比べてよい。`,
    hints: [
      "`if a.len() >= b.len() { a } else { b }`",
      "シグネチャはすでに書いてある。中身だけ書けばよい",
    ],
  },
  initialCode: `fn longest<'a>(a: &'a str, b: &'a str) -> &'a str {
    todo!()
}
`,
  solutionCode: `fn longest<'a>(a: &'a str, b: &'a str) -> &'a str {
    if a.len() >= b.len() { a } else { b }
}
`,
});
