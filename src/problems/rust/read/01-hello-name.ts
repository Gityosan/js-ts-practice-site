import { defineProblem } from "../../../core/schemas";

export default defineProblem({
  id: "rust-read-hello-name",
  stage: "read",
  language: "rust",
  scenario: "rust",
  copy: {
    title: "名前を変えてあいさつを変える",
    prompt: `## まず実行してみよう

**▶ 実行** を押すと、Rust Playground でコンパイル・実行されて、下の「出力プレビュー」に結果が出る（数秒かかる）。

次に、\`"Rust"\` の部分を自分の名前に変えて、もう一度実行しよう。

## コードを読んでみよう

\`\`\`rust
fn main() {
    let name = "Rust";
    println!("こんにちは、{}さん！", name);
}
\`\`\`

- \`fn main()\` … プログラムの入口
- \`let name = "Rust";\` … 変数 name に文字列を入れる
- \`println!\` … 1 行表示するマクロ。\`{}\` の位置に \`name\` の中身が入る

**\`"..."\` の中の文字だけ変えれば OK。** \`"\` を消すとエラーになるので注意。`,
    hints: [
      '`"Rust"` を `"あなたの名前"` に変えてみよう',
      '`{}` を 2 つにして、`println!("{}と{}", name, name);` も試せる',
    ],
  },
  initialCode: `fn main() {
    let name = "Rust"; // ← ここを変えて ▶ 実行！
    println!("こんにちは、{}さん！", name);
}
`,
  solutionCode: `fn main() {
    let name = "Rust"; // ← ここを変えて ▶ 実行！
    println!("こんにちは、{}さん！", name);
}
`,
});
