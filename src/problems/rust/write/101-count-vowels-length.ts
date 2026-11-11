import { defineProblem } from "../../../core/schemas";

export default defineProblem({
  id: "rust-count-vowels-length",
  stage: "write",
  language: "rust",
  scenario: "rust",
  copy: {
    title: "母音を数える・バイト数と文字数",
    prompt: `## やること

### count_vowels(s)

英字の母音（a, e, i, o, u と大文字の A, E, I, O, U）が何個あるか数える。

\`\`\`rust
count_vowels("Hello World")   // 3
count_vowels("rhythm")        // 0
\`\`\`

### lengths(s)

\`(バイト数, 文字数)\` をタプルで返す。

\`\`\`rust
lengths("hello")     // (5, 5)
lengths("こんにちは") // (15, 5)
\`\`\`

## ポイント

- \`for c in s.chars()\` で 1 文字（char）ずつ取り出せる
- 母音かどうかは \`"aeiouAEIOU".contains(c)\` で判定できる（\`contains\` は char も受け取れる）
- バイト数は \`s.len()\`、文字数は \`s.chars().count()\``,
    hints: [
      '`let mut n = 0; for c in s.chars() { if "aeiouAEIOU".contains(c) { n += 1; } } n`',
      "`(s.len(), s.chars().count())`",
    ],
  },
  initialCode: `fn count_vowels(s: &str) -> usize {
    todo!()
}

fn lengths(s: &str) -> (usize, usize) {
    todo!()
}
`,
  solutionCode: `fn count_vowels(s: &str) -> usize {
    let mut n = 0;
    for c in s.chars() {
        if "aeiouAEIOU".contains(c) {
            n += 1;
        }
    }
    n
}

fn lengths(s: &str) -> (usize, usize) {
    (s.len(), s.chars().count())
}
`,
});
