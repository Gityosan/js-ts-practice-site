import { defineProblem } from "../../../core/schemas";

export default defineProblem({
  id: "rust-lifetime-struct-excerpt",
  stage: "write",
  language: "rust",
  scenario: "rust",
  copy: {
    title: "参照を持つ構造体 Excerpt<'a>",
    prompt: `## やること

文章の一部を **借用して** 持つ構造体 \`Excerpt<'a>\` を作ろう。

\`\`\`rust
struct Excerpt<'a> {
    part: &'a str,
}
\`\`\`

- （1）\`first_sentence<'a>(text: &'a str) -> Excerpt<'a>\` … 最初の \`.\` より前の部分を持つ Excerpt を返す（\`.\` がなければ全体）
- （2）メソッド \`len(&self) -> usize\` … part のバイト長
- （3）メソッド \`text(&self) -> &'a str\` … part を **元の文字列のライフタイム** で返す

\`\`\`rust
let novel = String::from("Call me Ishmael. Some years ago...");
let e = first_sentence(&novel);
e.text()   // "Call me Ishmael"
e.len()    // 15
\`\`\`

\`text\` の戻り値を \`&'a str\` にしておくと、Excerpt を捨てた後でも（元の文字列が生きていれば）その参照を使い続けられる。`,
    hints: [
      "impl は `impl<'a> Excerpt<'a> { ... }` と書く",
      "`let part = text.split('.').next().unwrap();` で最初の `.` より前が取れる（`.` がなくても全体が返る）",
      "text は `self.part` を返すだけ",
    ],
  },
  initialCode: `#[derive(Debug)]
struct Excerpt<'a> {
    part: &'a str,
}

fn first_sentence<'a>(text: &'a str) -> Excerpt<'a> {
    todo!()
}

impl<'a> Excerpt<'a> {
    fn len(&self) -> usize {
        todo!()
    }

    fn text(&self) -> &'a str {
        todo!()
    }
}
`,
  solutionCode: `#[derive(Debug)]
struct Excerpt<'a> {
    part: &'a str,
}

fn first_sentence<'a>(text: &'a str) -> Excerpt<'a> {
    let part = text.split('.').next().unwrap();
    Excerpt { part }
}

impl<'a> Excerpt<'a> {
    fn len(&self) -> usize {
        self.part.len()
    }

    fn text(&self) -> &'a str {
        self.part
    }
}
`,
});
