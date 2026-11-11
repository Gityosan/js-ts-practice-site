import { defineProblem } from "../../../core/schemas";

export default defineProblem({
  id: "rust-fix-e0106-lifetime",
  stage: "write",
  language: "rust",
  scenario: "rust",
  copy: {
    title: "E0106 を直す: ライフタイム指定が足りない",
    prompt: `## やること

初期コードは **E0106（missing lifetime specifier）** でコンパイルできない。ライフタイム \`'a\` を付けて直そう。

- \`longer(a: &str, b: &str) -> &str\` … 長いほう（同じなら \`a\`）を返す。戻り値が \`a\` と \`b\` のどちらから来るか分からないので、両方に同じ \`'a\` を付ける
- 構造体 \`Highlight\` は文字列の一部への参照 \`&str\` をフィールドに持っている。構造体にもライフタイム引数が必要（\`struct Highlight<'a> { text: &'a str }\`）
- \`first_word(s: &str) -> Highlight\` … 最初の空白までを \`Highlight\` にして返す（空白がなければ全体）。こちらは引数が 1 つなので、構造体の型を \`Highlight<'_>\` または \`Highlight<'a>\` と書けばよい

\`\`\`rust
longer("apple", "fig")          // "apple"
first_word("hello world").text  // "hello"
\`\`\`


※ この問題の初期コードは **わざとコンパイルが通らない** ようになっている。エラーメッセージを読んで直そう。`,
    hints: [
      "`fn longer<'a>(a: &'a str, b: &'a str) -> &'a str`",
      "`struct Highlight<'a> { text: &'a str }`",
      "`fn first_word(s: &str) -> Highlight<'_>`",
    ],
  },
  initialCode: `fn longer(a: &str, b: &str) -> &str {
    if b.len() > a.len() { b } else { a }
}

struct Highlight {
    text: &str,
}

fn first_word(s: &str) -> Highlight {
    let end = s.find(' ').unwrap_or(s.len());
    Highlight { text: &s[..end] }
}
`,
  solutionCode: `fn longer<'a>(a: &'a str, b: &'a str) -> &'a str {
    if b.len() > a.len() { b } else { a }
}

struct Highlight<'a> {
    text: &'a str,
}

fn first_word(s: &str) -> Highlight<'_> {
    let end = s.find(' ').unwrap_or(s.len());
    Highlight { text: &s[..end] }
}
`,
});
