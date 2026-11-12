import { defineProblem } from "../../../core/schemas";

export default defineProblem({
  id: "rust-utf8-prefix",
  stage: "write",
  language: "rust",
  scenario: "rust",
  copy: {
    title: "先頭 n 文字を UTF-8 の境界で切り出す",
    prompt: `## やること

文字列の **先頭 n 文字**（バイトではなく文字）を \`&str\` で返す関数 \`take_chars\` を書こう。文字数が n に満たなければ全体を返す。

\`\`\`rust
take_chars("hello", 3)        // "hel"
take_chars("こんにちは", 2)    // "こん"
take_chars("héllo", 2)        // "hé"
take_chars("abc", 10)         // "abc"
take_chars("abc", 0)          // ""
\`\`\`

## なぜ &s[..n] ではダメなのか

\`&s[..n]\` の n は **バイト位置**。日本語は 1 文字 3 バイトなので、\`&"こんにちは"[..2]\` は文字の途中で切ることになり **panic** する。

## ポイント

\`char_indices()\` は \`(その文字が始まるバイト位置, 文字)\` を順に返す。

\`\`\`rust
for (i, c) in "aあb".char_indices() {
    println!("{i} {c}");   // 0 a / 1 あ / 4 b
}
\`\`\`

数えながら回し、**n 文字目（0 始まり）が始まるバイト位置** で切ればよい。`,
    hints: [
      "`let mut count = 0; for (i, _) in s.char_indices() { ... }`",
      "ループ内で `if count == n { return &s[..i]; } count += 1;`、最後まで来たら `s`",
    ],
  },
  initialCode: `fn take_chars(s: &str, n: usize) -> &str {
    todo!()
}
`,
  solutionCode: `fn take_chars(s: &str, n: usize) -> &str {
    let mut count = 0;
    for (i, _) in s.char_indices() {
        if count == n {
            return &s[..i];
        }
        count += 1;
    }
    s
}
`,
});
