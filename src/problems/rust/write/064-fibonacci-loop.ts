import { defineProblem } from "../../../core/schemas";

export default defineProblem({
  id: "rust-fibonacci-loop",
  stage: "write",
  language: "rust",
  scenario: "rust",
  copy: {
    title: "フィボナッチ数（for と loop の break 値）",
    prompt: `## やること

フィボナッチ数列: 0, 1, 1, 2, 3, 5, 8, 13, 21, ...（前の 2 つの和が次の数）

### fib(n)

n 番目（0 始まり）のフィボナッチ数を返す。\`for\` で書こう。

\`\`\`rust
fib(0)    // 0
fib(1)    // 1
fib(10)   // 55
\`\`\`

### first_fib_over(limit)

\`limit\` より **大きい** 最初のフィボナッチ数を返す。\`loop\` と **\`break 値\`** で書こう。

\`\`\`rust
first_fib_over(10)    // 13
first_fib_over(100)   // 144
\`\`\`

## ポイント

- 2 つの変数 \`a\`（今の数）と \`b\`（次の数）を用意し、1 歩ずつ進める
- 1 歩: 新しい a = b、新しい b = a + b。一時変数を使うか、タプルで \`(a, b) = (b, a + b);\` と同時代入できる
- \`let x = loop { ... break 値; ... };\` でループの結果を変数に入れられる
- 大きくなるので \`u64\` を使う`,
    hints: [
      "`let mut a = 0; let mut b = 1; for _ in 0..n { (a, b) = (b, a + b); } a`",
      "`loop { if a > limit { break a; } (a, b) = (b, a + b); }`",
    ],
  },
  initialCode: `fn fib(n: u32) -> u64 {
    todo!()
}

fn first_fib_over(limit: u64) -> u64 {
    todo!()
}
`,
  solutionCode: `fn fib(n: u32) -> u64 {
    let mut a: u64 = 0;
    let mut b: u64 = 1;
    for _ in 0..n {
        (a, b) = (b, a + b);
    }
    a
}

fn first_fib_over(limit: u64) -> u64 {
    let mut a: u64 = 0;
    let mut b: u64 = 1;
    loop {
        if a > limit {
            break a;
        }
        (a, b) = (b, a + b);
    }
}
`,
});
