import { defineProblem } from "../../../core/schemas";

export default defineProblem({
  id: "rust-lifetime-parser",
  stage: "write",
  language: "rust",
  scenario: "rust",
  copy: {
    title: "&str を持つ Parser で単語を切り出す",
    prompt: `## やること

入力文字列を借用して、単語を 1 つずつ切り出す \`Parser<'a>\` を作ろう。

\`\`\`rust
struct Parser<'a> {
    input: &'a str,   // 残りの入力
}
\`\`\`

| メソッド | 動き |
|---|---|
| \`new(input: &'a str) -> Parser<'a>\` | 作る |
| \`next_word(&mut self) -> Option<&'a str>\` | 先頭の空白を飛ばし、次の空白まで（または最後まで）を返す。もう単語がなければ \`None\` |
| \`rest(&self) -> &'a str\` | まだ読んでいない残りの入力 |

\`\`\`rust
let mut p = Parser::new("  let x = 5");
p.next_word()  // Some("let")
p.next_word()  // Some("x")
p.rest()       // " = 5"
\`\`\`

- 戻り値を \`&'a str\` にすることで、**Parser ではなく元の入力** を借りた参照になる。だから next_word を何度呼んでも前の結果を持ち続けられる
- \`trim_start()\`、\`find(' ')\`、スライス \`&s[..i]\` / \`&s[i..]\` が使える（入力は ASCII と考えてよい）`,
    hints: [
      "まず `let s = self.input.trim_start();` で先頭の空白を飛ばす。空なら `self.input = s; return None;`",
      "`let end = s.find(' ').unwrap_or(s.len());` で単語の終わりを求める",
      "`let word = &s[..end]; self.input = &s[end..]; Some(word)`",
    ],
  },
  initialCode: `struct Parser<'a> {
    input: &'a str,
}

impl<'a> Parser<'a> {
    fn new(input: &'a str) -> Parser<'a> {
        todo!()
    }

    fn next_word(&mut self) -> Option<&'a str> {
        todo!()
    }

    fn rest(&self) -> &'a str {
        todo!()
    }
}
`,
  solutionCode: `struct Parser<'a> {
    input: &'a str,
}

impl<'a> Parser<'a> {
    fn new(input: &'a str) -> Parser<'a> {
        Parser { input }
    }

    fn next_word(&mut self) -> Option<&'a str> {
        let s = self.input.trim_start();
        if s.is_empty() {
            self.input = s;
            return None;
        }
        let end = s.find(' ').unwrap_or(s.len());
        let word = &s[..end];
        self.input = &s[end..];
        Some(word)
    }

    fn rest(&self) -> &'a str {
        self.input
    }
}
`,
});
