import { defineProblem } from "../../../core/schemas";

export default defineProblem({
  id: "rust-num-string",
  stage: "write",
  language: "rust",
  scenario: "rust",
  copy: {
    title: "数値と文字列を相互に変換する",
    prompt: `## やること

数値 ⇔ 文字列の変換を 4 つの関数で練習しよう。

| 関数 | やること | 例 |
|---|---|---|
| \`parse_or_zero(s: &str) -> i32\` | 前後の空白を除いて整数に。失敗なら 0 | \`" 42 "\` → \`42\`、\`"x"\` → \`0\` |
| \`digit_sum(n: u64) -> u32\` | 各桁の和。\`to_string\` してから 1 文字ずつ数に | \`1234\` → \`10\` |
| \`from_binary(s: &str) -> Option<u32>\` | 2 進数の文字列を数に。失敗なら None | \`"1010"\` → \`Some(10)\` |
| \`to_padded(n: u32) -> String\` | 4 桁の 0 埋め文字列 | \`7\` → \`"0007"\` |

道具:
- \`s.trim().parse::<i32>()\` → \`Result\`。\`.unwrap_or(0)\` で失敗時 0
- \`c.to_digit(10)\` → \`Option<u32>\`（\`'7'\` → \`Some(7)\`）
- \`u32::from_str_radix(s, 2)\` → \`Result<u32, _>\`
- \`format!("{:04}", n)\` → 幅 4 で 0 埋め`,
    hints: [
      "parse_or_zero: `s.trim().parse().unwrap_or(0)`",
      "digit_sum: `for c in n.to_string().chars() { sum += c.to_digit(10).unwrap(); }`",
      "from_binary: `u32::from_str_radix(s, 2).ok()`",
    ],
  },
  initialCode: `fn parse_or_zero(s: &str) -> i32 {
    todo!()
}

fn digit_sum(n: u64) -> u32 {
    todo!()
}

fn from_binary(s: &str) -> Option<u32> {
    todo!()
}

fn to_padded(n: u32) -> String {
    todo!()
}
`,
  solutionCode: `fn parse_or_zero(s: &str) -> i32 {
    s.trim().parse().unwrap_or(0)
}

fn digit_sum(n: u64) -> u32 {
    let mut sum = 0;
    for c in n.to_string().chars() {
        sum += c.to_digit(10).unwrap();
    }
    sum
}

fn from_binary(s: &str) -> Option<u32> {
    u32::from_str_radix(s, 2).ok()
}

fn to_padded(n: u32) -> String {
    format!("{:04}", n)
}
`,
});
