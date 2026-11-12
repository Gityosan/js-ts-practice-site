import { defineProblem } from "../../../core/schemas";

export default defineProblem({
  id: "rust-result-combinators",
  stage: "write",
  language: "rust",
  scenario: "rust",
  copy: {
    title: "unwrap_or / ok_or / and_then で組み立てる",
    prompt: `## やること

match を書かずに、Option / Result のメソッドで処理を組み立てよう。

- \`parse_or(s: &str, default: i32) -> i32\` … 数値に変換できなければ default（\`unwrap_or\`）
- \`require(v: Option<i32>, name: &str) -> Result<i32, String>\` … None なら \`Err("x がありません")\`（name を含める）。\`ok_or_else\` を使う
- \`parse_positive(s: &str) -> Option<u32>\` … 数値に変換でき、かつ 0 より大きいときだけ Some。\`.ok()\` と \`.filter(..)\` で
- \`checked_total(prices: &[u32]) -> Option<u32>\` … 合計。**オーバーフローしたら None**。\`a.checked_add(b)\` は Option を返すので \`?\` でつなごう

\`\`\`rust
parse_or("12", 0);                  // 12
parse_or("abc", 0);                 // 0
require(None, "width");             // Err("width がありません")
parse_positive("0");                // None
checked_total(&[u32::MAX, 1]);      // None
\`\`\``,
    hints: [
      "`s.parse().unwrap_or(default)`",
      '`v.ok_or_else(|| format!("{name} がありません"))`',
      "`s.parse::<u32>().ok().filter(|&n| n > 0)`",
      "`let mut t: u32 = 0; for &p in prices { t = t.checked_add(p)?; } Some(t)`",
    ],
  },
  initialCode: `fn parse_or(s: &str, default: i32) -> i32 {
    todo!()
}

fn require(v: Option<i32>, name: &str) -> Result<i32, String> {
    todo!()
}

fn parse_positive(s: &str) -> Option<u32> {
    todo!()
}

fn checked_total(prices: &[u32]) -> Option<u32> {
    todo!()
}
`,
  solutionCode: `fn parse_or(s: &str, default: i32) -> i32 {
    s.parse().unwrap_or(default)
}

fn require(v: Option<i32>, name: &str) -> Result<i32, String> {
    v.ok_or_else(|| format!("{name} がありません"))
}

fn parse_positive(s: &str) -> Option<u32> {
    s.parse::<u32>().ok().filter(|&n| n > 0)
}

fn checked_total(prices: &[u32]) -> Option<u32> {
    let mut t: u32 = 0;
    for &p in prices {
        t = t.checked_add(p)?;
    }
    Some(t)
}
`,
});
