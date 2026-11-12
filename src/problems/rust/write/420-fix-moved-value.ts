import { defineProblem } from "../../../core/schemas";

export default defineProblem({
  id: "rust-fix-e0382-moved",
  stage: "write",
  language: "rust",
  scenario: "rust",
  copy: {
    title: "E0382 を直す: move した後の値を使っている",
    prompt: `## やること

初期コードは **コンパイルエラー（E0382: borrow of moved value）** になる。関数のシグネチャと中身を直して、コンパイルが通り正しく動くようにしよう。

- \`count_chars(s: String) -> usize\` は文字数を返すだけなので、所有権を奪う必要がない。**\`&str\` で借用して受け取る** ように変える
- \`describe(name: String) -> String\` の中で、\`name\` を \`count_chars\` に渡した後でもう一度使っている。借用で渡せば解決する

直したあとの期待動作:

\`\`\`rust
count_chars("hello")          // 5
describe(String::from("Rust")) // "Rust は 4 文字"
\`\`\`

採点は \`count_chars("hello")\`（\`&str\` を渡す）でも呼ぶので、引数の型は \`&str\` にすること。


※ この問題の初期コードは **わざとコンパイルが通らない** ようになっている。エラーメッセージを読んで直そう。`,
    hints: [
      "エラーの `value moved here` の位置を確認しよう",
      "`fn count_chars(s: &str) -> usize { s.chars().count() }`",
      "呼び出し側は `count_chars(&name)`（`&String` は自動で `&str` になる）",
    ],
  },
  initialCode: `fn count_chars(s: String) -> usize {
    s.chars().count()
}

fn describe(name: String) -> String {
    let n = count_chars(name);
    format!("{} は {} 文字", name, n)
}
`,
  solutionCode: `fn count_chars(s: &str) -> usize {
    s.chars().count()
}

fn describe(name: String) -> String {
    let n = count_chars(&name);
    format!("{} は {} 文字", name, n)
}
`,
});
