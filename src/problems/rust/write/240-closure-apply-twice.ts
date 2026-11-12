import { defineProblem } from "../../../core/schemas";

export default defineProblem({
  id: "rust-closure-apply-twice",
  stage: "write",
  language: "rust",
  scenario: "rust",
  copy: {
    title: "クロージャを受け取る apply_twice",
    prompt: `## やること

クロージャを引数に取る関数を 2 つ書こう。

- （1）\`apply_twice<F: Fn(i32) -> i32>(f: F, x: i32) -> i32\` … f を 2 回適用する（\`f(f(x))\`）
- （2）\`apply_n<F: Fn(i32) -> i32>(f: F, x: i32, n: usize) -> i32\` … f を n 回適用する（0 回なら x のまま）

\`\`\`rust
apply_twice(|x| x + 3, 1)       // 7
apply_twice(|x| x * x, 3)       // 81
apply_n(|x| x * 2, 1, 10)       // 1024
\`\`\`

- \`F: Fn(i32) -> i32\` は「i32 を受け取って i32 を返す、何回でも呼べるクロージャ」
- 周りの変数をキャプチャしたクロージャも渡せる: \`let k = 10; apply_twice(|x| x + k, 0)\` → 20
- 普通の関数名を渡すこともできる`,
    hints: [
      "apply_twice は `f(f(x))`",
      "apply_n は `let mut v = x; for _ in 0..n { v = f(v); } v`",
    ],
  },
  initialCode: `fn apply_twice<F: Fn(i32) -> i32>(f: F, x: i32) -> i32 {
    todo!()
}

fn apply_n<F: Fn(i32) -> i32>(f: F, x: i32, n: usize) -> i32 {
    todo!()
}
`,
  solutionCode: `fn apply_twice<F: Fn(i32) -> i32>(f: F, x: i32) -> i32 {
    f(f(x))
}

fn apply_n<F: Fn(i32) -> i32>(f: F, x: i32, n: usize) -> i32 {
    let mut v = x;
    for _ in 0..n {
        v = f(v);
    }
    v
}
`,
});
