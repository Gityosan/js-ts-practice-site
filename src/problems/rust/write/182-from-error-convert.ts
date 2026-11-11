import { defineProblem } from "../../../core/schemas";

export default defineProblem({
  id: "rust-from-error-question",
  stage: "write",
  language: "rust",
  scenario: "rust",
  copy: {
    title: "From でエラーを変換して ? を使う",
    prompt: `## やること

\`"幅x高さ"\`（例 \`"3x4"\`）形式の文字列から面積を求める。失敗の種類は 3 つ。

\`\`\`rust
enum DimError {
    Format,                    // "x" で 2 つに分けられない
    Parse(ParseIntError),      // 数値に変換できない（元のエラーを包む）
    Zero,                      // 幅か高さが 0
}
\`\`\`

- \`impl From<ParseIntError> for DimError\` を書いて、\`?\` で ParseIntError が自動的に \`DimError::Parse\` に変換されるようにする
- \`parse_dims(s: &str) -> Result<(u32, u32), DimError>\` … \`split_once('x')\` で分け、\`.parse::<u32>()?\` で変換。0 があれば \`Zero\`
- \`area(s: &str) -> Result<u32, DimError>\` … \`parse_dims(s)?\` を使って面積
- \`total_area(items: &[&str]) -> Result<u32, DimError>\` … すべての面積の合計。1 つでも失敗したらそのエラー
- Display: \`Format\` → \`形式は 幅x高さ です\`、\`Parse(e)\` → \`数値ではありません: {e}\`（e は ParseIntError の Display）、\`Zero\` → \`0 は指定できません\`

\`\`\`rust
area("3x4");     // Ok(12)
area("3x");      // Err(Parse(ParseIntError { kind: Empty }))
area("3*4");     // Err(Format)
\`\`\``,
    hints: [
      "`impl From<ParseIntError> for DimError { fn from(e: ParseIntError) -> Self { DimError::Parse(e) } }`",
      "`let (w, h) = s.split_once('x').ok_or(DimError::Format)?;`",
      "`let w: u32 = w.trim().parse()?;`（From のおかげで ? が通る）",
      'Display の Parse: `DimError::Parse(e) => write!(f, "数値ではありません: {e}")`',
    ],
  },
  initialCode: `use std::fmt;
use std::num::ParseIntError;

#[derive(Debug)]
enum DimError {
    Format,
    Parse(ParseIntError),
    Zero,
}

impl From<ParseIntError> for DimError {
    fn from(e: ParseIntError) -> Self {
        todo!()
    }
}

impl fmt::Display for DimError {
    fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
        todo!()
    }
}

impl std::error::Error for DimError {}

fn parse_dims(s: &str) -> Result<(u32, u32), DimError> {
    todo!()
}

fn area(s: &str) -> Result<u32, DimError> {
    todo!()
}

fn total_area(items: &[&str]) -> Result<u32, DimError> {
    todo!()
}
`,
  solutionCode: `use std::fmt;
use std::num::ParseIntError;

#[derive(Debug)]
enum DimError {
    Format,
    Parse(ParseIntError),
    Zero,
}

impl From<ParseIntError> for DimError {
    fn from(e: ParseIntError) -> Self {
        DimError::Parse(e)
    }
}

impl fmt::Display for DimError {
    fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
        match self {
            DimError::Format => write!(f, "形式は 幅x高さ です"),
            DimError::Parse(e) => write!(f, "数値ではありません: {e}"),
            DimError::Zero => write!(f, "0 は指定できません"),
        }
    }
}

impl std::error::Error for DimError {}

fn parse_dims(s: &str) -> Result<(u32, u32), DimError> {
    let (w, h) = s.split_once('x').ok_or(DimError::Format)?;
    let w: u32 = w.trim().parse()?;
    let h: u32 = h.trim().parse()?;
    if w == 0 || h == 0 {
        return Err(DimError::Zero);
    }
    Ok((w, h))
}

fn area(s: &str) -> Result<u32, DimError> {
    let (w, h) = parse_dims(s)?;
    Ok(w * h)
}

fn total_area(items: &[&str]) -> Result<u32, DimError> {
    let mut sum = 0;
    for s in items {
        sum += area(s)?;
    }
    Ok(sum)
}
`,
});
