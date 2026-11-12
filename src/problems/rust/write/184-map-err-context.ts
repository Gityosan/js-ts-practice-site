import { defineProblem } from "../../../core/schemas";

export default defineProblem({
  id: "rust-map-err-context",
  stage: "write",
  language: "rust",
  scenario: "rust",
  copy: {
    title: "map_err で文脈付きのエラーにする",
    prompt: `## やること

複数行の注文データ \`"商品名,個数,単価"\` を読み、合計金額を求める。
エラーには **何行目のどの項目か** という文脈を付けたい。そこで \`map_err\` を使う。

\`\`\`rust
#[derive(Debug, PartialEq)]
struct OrderError {
    line: usize,     // 1 始まりの行番号
    msg: String,
}
\`\`\`

- \`parse_order(line_no: usize, line: &str) -> Result<(String, u32, u32), OrderError>\`
  - カンマで分けて **ちょうど 3 項目** でなければ \`msg: "項目数が 3 ではありません"\`
  - 個数が数値でなければ \`msg: "個数 'abc' を読めません"\`、単価なら \`msg: "単価 'abc' を読めません"\`（項目は trim してから parse）。\`.map_err(|_| OrderError { .. })?\` で
- \`total(text: &str) -> Result<u32, OrderError>\` … 各行（空行は飛ばす）の 個数 × 単価 の合計。1 行でも失敗したらそのエラー
- \`OrderError\` に Display: \`2 行目: 個数 'abc' を読めません\`

\`\`\`rust
total("pen,2,100\\ncup,1,350");    // Ok(550)
total("pen,2,100\\ncup,x,350");    // Err(OrderError { line: 2, msg: "個数 'x' を読めません" })
\`\`\``,
    hints: [
      "`let parts: Vec<&str> = line.split(',').map(|s| s.trim()).collect(); if parts.len() != 3 { return Err(...); }`",
      "`let qty: u32 = parts[1].parse().map_err(|_| OrderError { line: line_no, msg: format!(\"個数 '{}' を読めません\", parts[1]) })?;`",
      "total: `for (i, line) in text.lines().enumerate()` で `i + 1` を行番号に",
    ],
  },
  initialCode: `use std::fmt;

#[derive(Debug, PartialEq)]
struct OrderError {
    line: usize,
    msg: String,
}

impl fmt::Display for OrderError {
    fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
        todo!()
    }
}

impl std::error::Error for OrderError {}

fn parse_order(line_no: usize, line: &str) -> Result<(String, u32, u32), OrderError> {
    todo!()
}

fn total(text: &str) -> Result<u32, OrderError> {
    todo!()
}
`,
  solutionCode: `use std::fmt;

#[derive(Debug, PartialEq)]
struct OrderError {
    line: usize,
    msg: String,
}

impl fmt::Display for OrderError {
    fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
        write!(f, "{} 行目: {}", self.line, self.msg)
    }
}

impl std::error::Error for OrderError {}

fn parse_order(line_no: usize, line: &str) -> Result<(String, u32, u32), OrderError> {
    let parts: Vec<&str> = line.split(',').map(|s| s.trim()).collect();
    if parts.len() != 3 {
        return Err(OrderError { line: line_no, msg: String::from("項目数が 3 ではありません") });
    }
    let qty: u32 = parts[1].parse().map_err(|_| OrderError {
        line: line_no,
        msg: format!("個数 '{}' を読めません", parts[1]),
    })?;
    let price: u32 = parts[2].parse().map_err(|_| OrderError {
        line: line_no,
        msg: format!("単価 '{}' を読めません", parts[2]),
    })?;
    Ok((parts[0].to_string(), qty, price))
}

fn total(text: &str) -> Result<u32, OrderError> {
    let mut sum = 0;
    for (i, line) in text.lines().enumerate() {
        if line.trim().is_empty() {
            continue;
        }
        let (_, qty, price) = parse_order(i + 1, line)?;
        sum += qty * price;
    }
    Ok(sum)
}
`,
});
