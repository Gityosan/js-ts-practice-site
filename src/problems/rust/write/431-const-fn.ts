import { defineProblem } from "../../../core/schemas";

export default defineProblem({
  id: "rust-const-fn-compile-time",
  stage: "write",
  language: "rust",
  scenario: "rust",
  copy: {
    title: "const fn でコンパイル時に計算する",
    prompt: `## やること

コンパイル時にも呼べる \`const fn\` を 3 つ書こう。採点では \`const\` の中で呼ぶので、**普通の \`fn\` ではコンパイルが通らない**。

| 関数 | 動き |
|---|---|
| \`const fn cube(x: i64) -> i64\` | 3 乗 |
| \`const fn fib(n: u32) -> u64\` | フィボナッチ数（\`fib(0) = 0\`, \`fib(1) = 1\`）。\`while\` ループで書く |
| \`const fn squares<const N: usize>() -> [u32; N]\` | \`[0, 1, 4, 9, ...]\` のように、添字の 2 乗を並べた長さ \`N\` の配列を返す |

## const fn の制約

- \`for\` ループは使えない → \`while\` を使う
- \`let mut\` やローカル変数の変更は OK
- 配列は \`let mut a = [0; N];\` で作って \`a[i] = ...\` と書き換えられる

採点例:

\`\`\`rust
const C: i64 = cube(3);        // 27
const F: u64 = fib(10);        // 55
const S: [u32; 4] = squares(); // [0, 1, 4, 9]
\`\`\``,
    hints: [
      "`const fn cube(x: i64) -> i64 { x * x * x }`",
      "fib: `let (mut a, mut b) = (0u64, 1u64); let mut i = 0; while i < n { let t = a + b; a = b; b = t; i += 1; } a`",
      "squares: `let mut a = [0u32; N]; let mut i = 0; while i < N { a[i] = (i * i) as u32; i += 1; } a`",
    ],
  },
  initialCode: `const fn cube(x: i64) -> i64 {
    todo!()
}

const fn fib(n: u32) -> u64 {
    todo!()
}

const fn squares<const N: usize>() -> [u32; N] {
    todo!()
}
`,
  solutionCode: `const fn cube(x: i64) -> i64 {
    x * x * x
}

const fn fib(n: u32) -> u64 {
    let (mut a, mut b) = (0u64, 1u64);
    let mut i = 0;
    while i < n {
        let t = a + b;
        a = b;
        b = t;
        i += 1;
    }
    a
}

const fn squares<const N: usize>() -> [u32; N] {
    let mut a = [0u32; N];
    let mut i = 0;
    while i < N {
        a[i] = (i * i) as u32;
        i += 1;
    }
    a
}
`,
});
