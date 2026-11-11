import { defineProblem } from "../../../core/schemas";

export default defineProblem({
  id: "rust-ex-simple-tokenizer",
  stage: "write",
  language: "rust",
  scenario: "rust",
  copy: {
    title: "総合: 簡易トークナイザ",
    prompt: `## やること

\`x = 12 * (y + 3)\` のような式を **トークン（字句）** の列に分解する \`tokenize(src: &str) -> Result<Vec<Token>, String>\` を書こう。

\`\`\`rust
#[derive(Debug, PartialEq)]
enum Token {
    Num(i64),       // 数: 0〜9 が 1 文字以上続いたもの
    Ident(String),  // 識別子: 英字か _ で始まり、英数字か _ が続くもの
    Op(char),       // 演算子: + - * / =
    LParen,         // (
    RParen,         // )
}
\`\`\`

- 空白（\`is_whitespace\`）は読み飛ばす
- それ以外の文字が来たら \`Err(format!("不明な文字 '{}' (位置 {})", 文字, 位置))\`（位置は \`chars()\` で数えた 0 始まり）

\`\`\`rust
tokenize("x = 12 * (y + 3)")
// Ok([Ident("x"), Op('='), Num(12), Op('*'), LParen, Ident("y"), Op('+'), Num(3), RParen])
\`\`\`

## 設計のヒント

数や識別子は複数の文字にまたがるので、\`let chars: Vec<char> = src.chars().collect();\` にして **添字 \`i\` を自分で進める** \`while\` ループが書きやすい。数が続く間 \`i\` を進めて、その範囲を \`String\` に集めてから \`parse\` する。`,
    hints: [
      "`while i < chars.len() { let c = chars[i]; if c.is_whitespace() { i += 1; continue; } ... }`",
      "数: `let start = i; while i < chars.len() && chars[i].is_ascii_digit() { i += 1; } let s: String = chars[start..i].iter().collect();`",
      "識別子の開始は `c.is_alphabetic() || c == '_'`、続きは `is_alphanumeric() || == '_'`",
    ],
  },
  initialCode: `#[derive(Debug, PartialEq)]
enum Token {
    Num(i64),
    Ident(String),
    Op(char),
    LParen,
    RParen,
}

fn tokenize(src: &str) -> Result<Vec<Token>, String> {
    let chars: Vec<char> = src.chars().collect();
    let mut tokens = Vec::new();
    let mut i = 0;
    todo!()
}
`,
  solutionCode: `#[derive(Debug, PartialEq)]
enum Token {
    Num(i64),
    Ident(String),
    Op(char),
    LParen,
    RParen,
}

fn tokenize(src: &str) -> Result<Vec<Token>, String> {
    let chars: Vec<char> = src.chars().collect();
    let mut tokens = Vec::new();
    let mut i = 0;
    while i < chars.len() {
        let c = chars[i];
        if c.is_whitespace() {
            i += 1;
        } else if c.is_ascii_digit() {
            let start = i;
            while i < chars.len() && chars[i].is_ascii_digit() {
                i += 1;
            }
            let s: String = chars[start..i].iter().collect();
            tokens.push(Token::Num(s.parse().unwrap()));
        } else if c.is_alphabetic() || c == '_' {
            let start = i;
            while i < chars.len() && (chars[i].is_alphanumeric() || chars[i] == '_') {
                i += 1;
            }
            tokens.push(Token::Ident(chars[start..i].iter().collect()));
        } else {
            let t = match c {
                '+' | '-' | '*' | '/' | '=' => Token::Op(c),
                '(' => Token::LParen,
                ')' => Token::RParen,
                _ => return Err(format!("不明な文字 '{}' (位置 {})", c, i)),
            };
            tokens.push(t);
            i += 1;
        }
    }
    Ok(tokens)
}
`,
});
