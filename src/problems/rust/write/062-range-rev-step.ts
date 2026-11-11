import { defineProblem } from "../../../core/schemas";

export default defineProblem({
  id: "rust-range-rev-step",
  stage: "write",
  language: "rust",
  scenario: "rust",
  copy: {
    title: "範囲・rev・step_by を使い分ける",
    prompt: `## やること

\`for\` と範囲を使って、次の 3 つの関数を書こう。

### sum_to(n)

1 から n まで（n を含む）の合計。

\`\`\`rust
sum_to(10)   // 55
\`\`\`

### sum_multiples(n, k)

0 から n まで（n を含む）の **k の倍数** の合計。\`step_by\` を使ってみよう。

\`\`\`rust
sum_multiples(10, 3)   // 0 + 3 + 6 + 9 = 18
\`\`\`

### largest_multiple(n, k)

1 から n までで **k の倍数のうち最大のもの**。\`.rev()\` で大きい方から調べ、見つかったら \`return\` する。見つからなければ 0。

\`\`\`rust
largest_multiple(20, 7)   // 14
largest_multiple(5, 9)    // 0
\`\`\`

## ポイント

- \`1..=n\` は n を含む、\`1..n\` は含まない
- \`(0..=n).step_by(k)\` は 0, k, 2k, ... と進む（\`step_by\` の引数は \`usize\`）
- \`(1..=n).rev()\` は n, n-1, ..., 1 の順`,
    hints: [
      "`let mut total = 0; for i in 1..=n { total += i; } total`",
      "`for i in (0..=n).step_by(k as usize) { ... }`",
      "`for i in (1..=n).rev() { if i % k == 0 { return i; } } 0`",
    ],
  },
  initialCode: `fn sum_to(n: u32) -> u32 {
    todo!()
}

fn sum_multiples(n: u32, k: u32) -> u32 {
    todo!()
}

fn largest_multiple(n: u32, k: u32) -> u32 {
    todo!()
}
`,
  solutionCode: `fn sum_to(n: u32) -> u32 {
    let mut total = 0;
    for i in 1..=n {
        total += i;
    }
    total
}

fn sum_multiples(n: u32, k: u32) -> u32 {
    let mut total = 0;
    for i in (0..=n).step_by(k as usize) {
        total += i;
    }
    total
}

fn largest_multiple(n: u32, k: u32) -> u32 {
    for i in (1..=n).rev() {
        if i % k == 0 {
            return i;
        }
    }
    0
}
`,
});
