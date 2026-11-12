import { defineProblem } from "../../../core/schemas";

export default defineProblem({
  id: "rust-mut-ref-string-edit",
  stage: "write",
  language: "rust",
  scenario: "rust",
  copy: {
    title: "&mut String で文字列を編集する",
    prompt: `## やること

\`&mut String\` を受け取って文字列をその場で編集する関数を 2 つ書こう。

### add_suffix(s, suffix)

\`s\` の末尾に \`suffix\` を付け足す。

\`\`\`rust
let mut s = String::from("file");
add_suffix(&mut s, ".txt");
// s は "file.txt"
\`\`\`

### truncate_to(s, max)

\`s\` が \`max\` バイトより長ければ、先頭 \`max\` バイトだけ残して後ろを捨てる。短ければ何もしない。入力は ASCII だけと仮定してよい。

\`\`\`rust
let mut s = String::from("abcdef");
truncate_to(&mut s, 3);
// s は "abc"
\`\`\`

## ポイント

- \`s.push_str(suffix)\` で文字列を追加できる
- \`s.truncate(n)\` で先頭 n バイトだけ残せる（n が長さ以上なら何もしない）
- 戻り値はなし。呼び出し元の \`String\` が直接変わる`,
    hints: [
      "`s.push_str(suffix);`",
      "`if s.len() > max { s.truncate(max); }`（`s.truncate(max)` だけでも OK）",
    ],
  },
  initialCode: `fn add_suffix(s: &mut String, suffix: &str) {
    todo!()
}

fn truncate_to(s: &mut String, max: usize) {
    todo!()
}
`,
  solutionCode: `fn add_suffix(s: &mut String, suffix: &str) {
    s.push_str(suffix);
}

fn truncate_to(s: &mut String, max: usize) {
    if s.len() > max {
        s.truncate(max);
    }
}
`,
});
