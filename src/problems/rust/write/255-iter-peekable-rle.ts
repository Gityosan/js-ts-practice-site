import { defineProblem } from "../../../core/schemas";

export default defineProblem({
  id: "rust-iter-peekable-rle",
  stage: "write",
  language: "rust",
  scenario: "rust",
  copy: {
    title: "peekable で連続する文字をまとめる",
    prompt: `## やること

**ランレングス圧縮**（同じ文字の連続を「文字 + 個数」にまとめる）を \`peekable\` を使って書こう。

- （1）\`runs(s: &str) -> Vec<(char, usize)>\` … 連続する同じ文字を (文字, 個数) にまとめる
- （2）\`encode(s: &str) -> String\` … runs の結果を \`"a3b1c2"\` の形の文字列にする（\`map\` + \`collect::<String>()\` や \`fold\`）

\`\`\`rust
runs("aaabcc")    // [('a', 3), ('b', 1), ('c', 2)]
encode("aaabcc")  // "a3b1c2"
encode("")        // ""
\`\`\`

\`peekable()\` を付けたイテレータでは、\`peek()\` で **次の要素を消費せずに覗ける**（\`Option<&char>\` が返る）。

\`\`\`rust
let mut it = s.chars().peekable();
while let Some(c) = it.next() {
    // it.peek() == Some(&c) の間、it.next() で消費して数える
}
\`\`\``,
    hints: [
      "`let mut n = 1; while it.peek() == Some(&c) { it.next(); n += 1; } out.push((c, n));`",
      'encode は `runs(s).iter().map(|(c, n)| format!("{}{}", c, n)).collect()`',
      "`collect::<String>()` は String のイテレータもつなげて 1 つの String にできる",
    ],
  },
  initialCode: `fn runs(s: &str) -> Vec<(char, usize)> {
    todo!()
}

fn encode(s: &str) -> String {
    todo!()
}
`,
  solutionCode: `fn runs(s: &str) -> Vec<(char, usize)> {
    let mut out = Vec::new();
    let mut it = s.chars().peekable();
    while let Some(c) = it.next() {
        let mut n = 1;
        while it.peek() == Some(&c) {
            it.next();
            n += 1;
        }
        out.push((c, n));
    }
    out
}

fn encode(s: &str) -> String {
    runs(s)
        .iter()
        .map(|(c, n)| format!("{}{}", c, n))
        .collect()
}
`,
});
