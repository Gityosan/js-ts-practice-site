import { defineProblem } from "../../../core/schemas";

export default defineProblem({
  id: "rust-question-mark-parse-sum",
  stage: "write",
  language: "rust",
  scenario: "rust",
  copy: {
    title: "? で文字列の数値を合計する",
    prompt: `## やること

カンマ区切りの数値文字列を合計する \`sum_csv(s: &str) -> Result<i32, ParseIntError>\` を書こう。

- \`s.split(',')\` で分け、各要素の前後の空白を \`trim()\` で除いてから \`parse::<i32>()\`
- 1 つでも数値でなければ **その ParseIntError をそのまま返す**。\`?\` 演算子を使おう
- 空文字列 \`""\` は「要素が 1 つ（空文字列）」なので Err になる（空文字列の parse は失敗する）

\`\`\`rust
sum_csv("1, 2, 3");    // Ok(6)
sum_csv("10,x,3");     // Err(ParseIntError { kind: InvalidDigit })
\`\`\`

さらに \`average_csv(s: &str) -> Result<f64, ParseIntError>\` を書こう。\`sum_csv\` を \`?\` で呼んで、要素数で割った平均を返す。

\`?\` は「Ok なら中身を取り出し、Err ならその場で関数から Err を返す」。`,
    hints: [
      "`let mut total = 0; for part in s.split(',') { total += part.trim().parse::<i32>()?; } Ok(total)`",
      "average: `let total = sum_csv(s)?; let n = s.split(',').count(); Ok(total as f64 / n as f64)`",
    ],
  },
  initialCode: `use std::num::ParseIntError;

fn sum_csv(s: &str) -> Result<i32, ParseIntError> {
    todo!()
}

fn average_csv(s: &str) -> Result<f64, ParseIntError> {
    todo!()
}
`,
  solutionCode: `use std::num::ParseIntError;

fn sum_csv(s: &str) -> Result<i32, ParseIntError> {
    let mut total = 0;
    for part in s.split(',') {
        total += part.trim().parse::<i32>()?;
    }
    Ok(total)
}

fn average_csv(s: &str) -> Result<f64, ParseIntError> {
    let total = sum_csv(s)?;
    let n = s.split(',').count();
    Ok(total as f64 / n as f64)
}
`,
});
