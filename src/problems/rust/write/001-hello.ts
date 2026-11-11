import { defineProblem } from "../../../core/schemas";

export default defineProblem({
  id: "rust-hello",
  stage: "write",
  language: "rust",
  scenario: "rust",
  copy: {
    title: "Hello, Rust! を表示する",
    prompt: `## やること

\`Hello, Rust!\` と 1 行表示するプログラムを書こう。

\`\`\`rust
fn main() {
    println!("ここに文字列");
}
\`\`\`

- 文字列は \`"..."\`（ダブルクォート）で囲む
- 文の最後に \`;\` を忘れずに`,
    hints: ['`println!("Hello, Rust!");`', "`!` を付け忘れると関数扱いになってエラーになる"],
  },
  initialCode: `fn main() {
    // ここで Hello, Rust! を表示しよう
}
`,
  solutionCode: `fn main() {
    println!("Hello, Rust!");
}
`,
});
