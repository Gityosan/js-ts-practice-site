import { defineProblem } from "../../../core/schemas";

export default defineProblem({
  id: "rust-trait-newtype-display",
  stage: "write",
  language: "rust",
  scenario: "rust",
  copy: {
    title: "ニュータイプで外部の型に Display",
    prompt: `## やること

孤児ルールのため \`Vec<String>\` や \`u64\` に直接 \`Display\` は実装できない。**ニュータイプ** で包んで実装しよう。

- \`List(Vec<String>)\` … \`Display\` は \`[a, b, c]\` の形（空なら \`[]\`）
- \`Yen(u64)\` … \`Display\` は \`¥1,234,567\` のように **3 桁ごとにカンマ**（\`¥0\`、\`¥999\`、\`¥1,000\`）
- \`Yen\` に \`Add\` を実装して \`Yen(500) + Yen(700)\` → \`Yen(1200)\`
- \`Email\` … \`Email::parse(s: &str) -> Option<Email>\`: \`@\` を **ちょうど 1 つ** 含み、その前後が空でなければ \`Some\`。\`domain(&self) -> &str\` で \`@\` より後ろを返す。フィールドを外から作らせないことで「Email 型の値なら必ず検証済み」を保証するのがニュータイプの狙い

\`\`\`rust
List(vec!["a".into(), "b".into()]).to_string() // "[a, b]"
Yen(1234567).to_string()                       // "¥1,234,567"
Email::parse("me@example.com").unwrap().domain() // "example.com"
Email::parse("bad@@x").is_none()               // true
\`\`\``,
    hints: [
      '`List` は `write!(f, "[{}]", self.0.join(", "))`。',
      "`Yen` は数字の文字列を後ろから 3 文字ずつ区切る。`let s = self.0.to_string();` して、`for (i, ch) in s.chars().enumerate()` で `(s.len() - i) % 3 == 0 && i != 0` のときにカンマを入れる。",
      "`Email::parse` は `s.split('@').collect::<Vec<_>>()` の長さが 2 で、両方が空でないかを調べる。",
    ],
  },
  initialCode: `use std::fmt;
use std::ops::Add;

struct List(Vec<String>);

#[derive(Debug, Clone, Copy, PartialEq)]
struct Yen(u64);

#[derive(Debug)]
struct Email(String);

impl Email {
    fn parse(s: &str) -> Option<Email> {
        todo!()
    }

    fn domain(&self) -> &str {
        todo!()
    }
}

// ここに List と Yen の Display、Yen の Add を実装する
`,
  solutionCode: `use std::fmt;
use std::ops::Add;

struct List(Vec<String>);

#[derive(Debug, Clone, Copy, PartialEq)]
struct Yen(u64);

#[derive(Debug)]
struct Email(String);

impl Email {
    fn parse(s: &str) -> Option<Email> {
        let parts: Vec<&str> = s.split('@').collect();
        if parts.len() == 2 && !parts[0].is_empty() && !parts[1].is_empty() {
            Some(Email(s.to_string()))
        } else {
            None
        }
    }

    fn domain(&self) -> &str {
        self.0.split('@').nth(1).unwrap()
    }
}

impl fmt::Display for List {
    fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
        write!(f, "[{}]", self.0.join(", "))
    }
}

impl fmt::Display for Yen {
    fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
        let s = self.0.to_string();
        let mut out = String::new();
        for (i, ch) in s.chars().enumerate() {
            if i != 0 && (s.len() - i) % 3 == 0 {
                out.push(',');
            }
            out.push(ch);
        }
        write!(f, "¥{}", out)
    }
}

impl Add for Yen {
    type Output = Yen;
    fn add(self, o: Yen) -> Yen {
        Yen(self.0 + o.0)
    }
}
`,
});
