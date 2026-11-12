import { defineProblem } from "../../../core/schemas";

export default defineProblem({
  id: "rust-types-never",
  stage: "write",
  language: "rust",
  scenario: "rust",
  copy: {
    title: "never 型 ! を使う",
    prompt: `## やること

never 型 \`!\` を使う関数を書こう。

- \`fail(msg: &str) -> !\` … \`msg\` をメッセージにして panic する（決して返らない）
- \`checked_div(a: i32, b: i32) -> i32\` … \`b\` が 0 なら \`fail("division by zero")\`、そうでなければ \`a / b\`。\`if\` の片方の腕が \`!\` 型なので、全体は \`i32\` になる
- \`sum_numbers(items: &[&str]) -> i32\` … 整数として読めるものだけ合計する。\`match\` の \`Err\` の腕で \`continue\`（\`!\` 型）を使う
- \`first_even(xs: &[i32]) -> i32\` … 最初の偶数を返す。**ないときは \`fail("no even number")\`**。\`for\` ループの後ろに \`fail(...)\` を置けば、関数の最後の式として \`i32\` の代わりになる

\`\`\`rust
checked_div(7, 2)              // 3
checked_div(1, 0)              // panic: division by zero
sum_numbers(&["1", "x", "20"]) // 21
first_even(&[3, 5, 8, 10])     // 8
\`\`\``,
    hints: [
      '`fn fail(msg: &str) -> ! { panic!("{}", msg) }`',
      "`let n: i32 = match s.parse() { Ok(n) => n, Err(_) => continue };`",
      '`first_even` は `for &x in xs { if x % 2 == 0 { return x; } } fail("no even number")`。',
    ],
  },
  initialCode: `fn fail(msg: &str) -> ! {
    todo!()
}

fn checked_div(a: i32, b: i32) -> i32 {
    todo!()
}

fn sum_numbers(items: &[&str]) -> i32 {
    todo!()
}

fn first_even(xs: &[i32]) -> i32 {
    todo!()
}
`,
  solutionCode: `fn fail(msg: &str) -> ! {
    panic!("{}", msg)
}

fn checked_div(a: i32, b: i32) -> i32 {
    if b == 0 {
        fail("division by zero")
    } else {
        a / b
    }
}

fn sum_numbers(items: &[&str]) -> i32 {
    let mut sum = 0;
    for s in items {
        let n: i32 = match s.parse() {
            Ok(n) => n,
            Err(_) => continue,
        };
        sum += n;
    }
    sum
}

fn first_even(xs: &[i32]) -> i32 {
    for &x in xs {
        if x % 2 == 0 {
            return x;
        }
    }
    fail("no even number")
}
`,
});
