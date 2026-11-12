import { defineProblem } from "../../../core/schemas";

export default defineProblem({
  id: "rust-custom-error-display",
  stage: "write",
  language: "rust",
  scenario: "rust",
  copy: {
    title: "独自エラー enum と Display",
    prompt: `## やること

ユーザー名の検証を行い、失敗の種類を enum で返そう。

\`\`\`rust
#[derive(Debug, PartialEq)]
enum NameError {
    Empty,                 // 空
    TooLong(usize),        // 長すぎる（実際の文字数）
    InvalidChar(char),     // 使えない文字（最初に見つかったもの）
}
\`\`\`

- \`validate(name: &str) -> Result<String, NameError>\` … 検証して OK なら名前を String で返す
  - 空なら \`Empty\`
  - **文字数**（\`chars().count()\`）が 10 を超えたら \`TooLong(文字数)\`
  - 英小文字・数字・\`_\` 以外の文字があれば \`InvalidChar(その文字)\`
  - チェックはこの順で行う
- \`NameError\` に **\`fmt::Display\`** を実装
  - \`Empty\` → \`名前が空です\`
  - \`TooLong(n)\` → \`名前が長すぎます（n 文字、最大 10 文字）\`
  - \`InvalidChar(c)\` → \`使えない文字があります: 'c'\`
- \`std::error::Error\` も実装する（中身は空でよい）

\`\`\`rust
validate("rust_2024");           // Ok("rust_2024")
validate("Rust");                // Err(InvalidChar('R'))
validate("").unwrap_err().to_string();   // "名前が空です"
\`\`\``,
    hints: [
      "`if name.is_empty() { return Err(NameError::Empty); }`",
      "`for c in name.chars() { if !(c.is_ascii_lowercase() || c.is_ascii_digit() || c == '_') { return Err(NameError::InvalidChar(c)); } }`",
      'Display: `match self { NameError::Empty => write!(f, "名前が空です"), ... }`',
      "`'c'` のように引用符で囲むなら `write!(f, \"使えない文字があります: '{c}'\")`",
    ],
  },
  initialCode: `use std::fmt;

#[derive(Debug, PartialEq)]
enum NameError {
    Empty,
    TooLong(usize),
    InvalidChar(char),
}

impl fmt::Display for NameError {
    fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
        todo!()
    }
}

impl std::error::Error for NameError {}

fn validate(name: &str) -> Result<String, NameError> {
    todo!()
}
`,
  solutionCode: `use std::fmt;

#[derive(Debug, PartialEq)]
enum NameError {
    Empty,
    TooLong(usize),
    InvalidChar(char),
}

impl fmt::Display for NameError {
    fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
        match self {
            NameError::Empty => write!(f, "名前が空です"),
            NameError::TooLong(n) => write!(f, "名前が長すぎます（{n} 文字、最大 10 文字）"),
            NameError::InvalidChar(c) => write!(f, "使えない文字があります: '{c}'"),
        }
    }
}

impl std::error::Error for NameError {}

fn validate(name: &str) -> Result<String, NameError> {
    if name.is_empty() {
        return Err(NameError::Empty);
    }
    let len = name.chars().count();
    if len > 10 {
        return Err(NameError::TooLong(len));
    }
    for c in name.chars() {
        if !(c.is_ascii_lowercase() || c.is_ascii_digit() || c == '_') {
            return Err(NameError::InvalidChar(c));
        }
    }
    Ok(name.to_string())
}
`,
});
