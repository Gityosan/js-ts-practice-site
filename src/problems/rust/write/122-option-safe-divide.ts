import { defineProblem } from "../../../core/schemas";

export default defineProblem({
  id: "rust-option-safe-divide",
  stage: "write",
  language: "rust",
  scenario: "rust",
  copy: {
    title: "Option で安全な割り算",
    prompt: `## やること

0 で割ると Rust の整数演算は **panic** する。代わりに \`Option\` で結果を返す関数を書こう。

- \`safe_div(a: i32, b: i32) -> Option<i32>\` … \`b\` が 0 なら \`None\`、それ以外は \`Some(a / b)\`
- \`div_or_zero(a: i32, b: i32) -> i32\` … \`safe_div\` を使い、None のときは 0 を返す（\`unwrap_or\` を使ってみよう）
- \`describe(r: Option<i32>) -> String\` … \`Some(v)\` なら \`"結果: v"\`、\`None\` なら \`"計算できません"\`（\`match\` で）

\`\`\`rust
safe_div(10, 3);          // Some(3)
safe_div(1, 0);           // None
div_or_zero(1, 0);        // 0
describe(Some(5));        // "結果: 5"
\`\`\`

null の代わりに None を返すことで、呼び出し側は「割れなかった場合」を必ず考えることになる。`,
    hints: [
      "`if b == 0 { None } else { Some(a / b) }`",
      "`safe_div(a, b).unwrap_or(0)`",
      '`match r { Some(v) => format!("結果: {v}"), None => String::from("計算できません") }`',
    ],
  },
  initialCode: `fn safe_div(a: i32, b: i32) -> Option<i32> {
    todo!()
}

fn div_or_zero(a: i32, b: i32) -> i32 {
    todo!()
}

fn describe(r: Option<i32>) -> String {
    todo!()
}
`,
  solutionCode: `fn safe_div(a: i32, b: i32) -> Option<i32> {
    if b == 0 { None } else { Some(a / b) }
}

fn div_or_zero(a: i32, b: i32) -> i32 {
    safe_div(a, b).unwrap_or(0)
}

fn describe(r: Option<i32>) -> String {
    match r {
        Some(v) => format!("結果: {v}"),
        None => String::from("計算できません"),
    }
}
`,
});
