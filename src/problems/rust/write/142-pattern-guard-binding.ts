import { defineProblem } from "../../../core/schemas";

export default defineProblem({
  id: "rust-pattern-guard-at",
  stage: "write",
  language: "rust",
  scenario: "rust",
  copy: {
    title: "マッチガードと @ バインディング",
    prompt: `## やること

- \`age_group(age: u32) -> String\` … **@ バインディング** を使って、年齢そのものも文字列に入れる
  - 0〜5 → \`"3歳: 幼児"\` のように \`"{n}歳: 幼児"\`
  - 6〜12 → \`"{n}歳: 子ども"\`、13〜19 → \`"{n}歳: 十代"\`、20 以上 → \`"{n}歳: 大人"\`
- \`fizzbuzz(n: u32) -> String\` … **マッチガード** を使う。\`match n { x if x % 15 == 0 => ... }\` の形で、15 の倍数 → \`"FizzBuzz"\`、3 の倍数 → \`"Fizz"\`、5 の倍数 → \`"Buzz"\`、それ以外 → 数字の文字列
- \`compare(pair: (i32, i32)) -> &'static str\` … \`(a, b)\` が 等しい → \`"同じ"\`、和が 0 → \`"逆符号"\`、a > b → \`"左が大"\`、それ以外 → \`"右が大"\`（ガードで）

\`\`\`rust
age_group(15);    // "15歳: 十代"
fizzbuzz(9);      // "Fizz"
compare((3, -3)); // "逆符号"
\`\`\`

マッチガードは網羅性の判定に使われないので、最後にガードなしの腕（\`_\` や変数）を置こう。`,
    hints: [
      '`n @ 0..=5 => format!("{n}歳: 幼児")`',
      '最後の腕は `n => format!("{n}歳: 大人")` で残り全部を受ける',
      "fizzbuzz の最後の腕: `x => x.to_string()`",
      'compare: `(a, b) if a == b => "同じ"`',
    ],
  },
  initialCode: `fn age_group(age: u32) -> String {
    todo!()
}

fn fizzbuzz(n: u32) -> String {
    todo!()
}

fn compare(pair: (i32, i32)) -> &'static str {
    todo!()
}
`,
  solutionCode: `fn age_group(age: u32) -> String {
    match age {
        n @ 0..=5 => format!("{n}歳: 幼児"),
        n @ 6..=12 => format!("{n}歳: 子ども"),
        n @ 13..=19 => format!("{n}歳: 十代"),
        n => format!("{n}歳: 大人"),
    }
}

fn fizzbuzz(n: u32) -> String {
    match n {
        x if x % 15 == 0 => String::from("FizzBuzz"),
        x if x % 3 == 0 => String::from("Fizz"),
        x if x % 5 == 0 => String::from("Buzz"),
        x => x.to_string(),
    }
}

fn compare(pair: (i32, i32)) -> &'static str {
    match pair {
        (a, b) if a == b => "同じ",
        (a, b) if a + b == 0 => "逆符号",
        (a, b) if a > b => "左が大",
        _ => "右が大",
    }
}
`,
});
