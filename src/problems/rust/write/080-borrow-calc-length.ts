import { defineProblem } from "../../../core/schemas";

export default defineProblem({
  id: "rust-borrow-calc-length",
  stage: "write",
  language: "rust",
  scenario: "rust",
  copy: {
    title: "参照を受け取って長さを数える",
    prompt: `## やること

\`String\` への **参照** を受け取り、次の値を返す関数を 2 つ書こう。所有権は受け取らないので、呼び出し元は呼んだ後も文字列を使い続けられる。

- \`byte_len(s: &String) -> usize\` … バイト数（\`len()\`）
- \`count_char(s: &String, target: char) -> usize\` … \`target\` が何回出てくるか

\`\`\`rust
let s = String::from("banana");
byte_len(&s)          // 6
count_char(&s, 'a')   // 3
println!("{s}");      // s はまだ使える
\`\`\`

## ポイント

- 引数の型 \`&String\` は「String への参照」
- 参照でもメソッドはそのまま呼べる（\`s.len()\`、\`s.chars()\`）
- \`for c in s.chars() { ... }\` で 1 文字ずつ取り出せる`,
    hints: ["`s.len()`", "`let mut n = 0; for c in s.chars() { if c == target { n += 1; } } n`"],
  },
  initialCode: `fn byte_len(s: &String) -> usize {
    todo!()
}

fn count_char(s: &String, target: char) -> usize {
    todo!()
}
`,
  solutionCode: `fn byte_len(s: &String) -> usize {
    s.len()
}

fn count_char(s: &String, target: char) -> usize {
    let mut n = 0;
    for c in s.chars() {
        if c == target {
            n += 1;
        }
    }
    n
}
`,
});
