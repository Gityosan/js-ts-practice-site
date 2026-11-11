import { defineProblem } from "../../../core/schemas";

export default defineProblem({
  id: "rust-char-basics",
  stage: "write",
  language: "rust",
  scenario: "rust",
  copy: {
    title: "char とコードポイント",
    prompt: `## やること

\`char\` を扱う 3 つの関数を書こう。

### code_point(c)

文字の Unicode コードポイント（番号）を \`u32\` で返す。

\`\`\`rust
code_point('A')   // 65
code_point('あ')  // 12354
\`\`\`

### digit_char(d)

0〜9 の数 \`d\`（\`u8\`）を、対応する数字の文字に変換する。

\`\`\`rust
digit_char(7)  // '7'
\`\`\`

### is_vowel_or_digit(c)

\`c\` が英小文字の母音（a, e, i, o, u）か、ASCII の数字（0〜9）なら \`true\`。

\`\`\`rust
is_vowel_or_digit('e')  // true
is_vowel_or_digit('5')  // true
is_vowel_or_digit('z')  // false
\`\`\`

## ポイント

- \`c as u32\` でコードポイントになる
- \`b'0'\` は \`'0'\` のバイト値（48）。\`(b'0' + d) as char\` で数字の文字になる
- \`c.is_ascii_digit()\` で数字かどうか判定できる
- \`==\` で char を比べ、\`||\` でつなげる`,
    hints: [
      "`c as u32`",
      "`(b'0' + d) as char`",
      "`c == 'a' || c == 'e' || ... || c.is_ascii_digit()`",
    ],
  },
  initialCode: `fn code_point(c: char) -> u32 {
    todo!()
}

fn digit_char(d: u8) -> char {
    todo!()
}

fn is_vowel_or_digit(c: char) -> bool {
    todo!()
}
`,
  solutionCode: `fn code_point(c: char) -> u32 {
    c as u32
}

fn digit_char(d: u8) -> char {
    (b'0' + d) as char
}

fn is_vowel_or_digit(c: char) -> bool {
    c == 'a' || c == 'e' || c == 'i' || c == 'o' || c == 'u' || c.is_ascii_digit()
}
`,
});
