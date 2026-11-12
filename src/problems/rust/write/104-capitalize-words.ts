import { defineProblem } from "../../../core/schemas";

export default defineProblem({
  id: "rust-capitalize-words",
  stage: "write",
  language: "rust",
  scenario: "rust",
  copy: {
    title: "単語ごとに先頭を大文字にする",
    prompt: `## やること

空白で区切られた単語それぞれの **先頭の文字だけを大文字** にし、単語を **半角スペース 1 つ** でつないだ \`String\` を返す関数 \`capitalize_words\` を書こう。2 文字目以降はそのまま。

\`\`\`rust
capitalize_words("hello rust world")   // "Hello Rust World"
capitalize_words("  many   spaces ")   // "Many Spaces"
capitalize_words("iPhone")             // "IPhone"
capitalize_words("")                   // ""
\`\`\`

## ポイント

- \`s.split_whitespace()\` は連続する空白をまとめて区切り、前後の空白も無視して単語（\`&str\`）を順に返す
- 単語の先頭の文字と残りを分ける:

\`\`\`rust
let mut chars = word.chars();
if let Some(first) = chars.next() {   // 最初の 1 文字を取り出す
    // first: 先頭の char
    // chars.as_str(): 残りの部分（&str）
}
\`\`\`

- \`first.to_uppercase()\` は大文字のイテレータ。\`String\` に \`extend\` するか \`collect::<String>()\` する
- 単語の間にだけスペースを入れる: 結果が空でなければ \`push(' ')\` してから単語を追加する（または単語を \`Vec<String>\` に集めて \`join(" ")\`）
- \`if let Some(x) = ... { }\` は「値があれば取り出して処理する」構文（後の章で詳しく）`,
    hints: [
      "`for word in s.split_whitespace() { ... }`",
      "`if !result.is_empty() { result.push(' '); }` の後、先頭を `result.extend(first.to_uppercase());`、残りを `result.push_str(chars.as_str());`",
    ],
  },
  initialCode: `fn capitalize_words(s: &str) -> String {
    todo!()
}
`,
  solutionCode: `fn capitalize_words(s: &str) -> String {
    let mut result = String::new();
    for word in s.split_whitespace() {
        if !result.is_empty() {
            result.push(' ');
        }
        let mut chars = word.chars();
        if let Some(first) = chars.next() {
            result.extend(first.to_uppercase());
            result.push_str(chars.as_str());
        }
    }
    result
}
`,
});
