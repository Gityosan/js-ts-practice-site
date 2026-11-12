import { defineProblem } from "../../../core/schemas";

export default defineProblem({
  id: "rust-closure-fnmut-counter",
  stage: "write",
  language: "rust",
  scenario: "rust",
  copy: {
    title: "状態を持つクロージャ（FnMut）",
    prompt: `## やること

### 1. カウンタを返す

\`make_counter() -> impl FnMut() -> u32\` … 呼ぶたびに 1, 2, 3, … を返すクロージャを返す。

\`\`\`rust
let mut c = make_counter();
c()  // 1
c()  // 2
\`\`\`

関数の中で \`let mut count = 0;\` を作り、それを \`move\` でクロージャに持たせて書き換える。クロージャが状態を書き換えるので **FnMut** になる。

### 2. FnMut を受け取る

\`call_n<F: FnMut() -> u32>(mut f: F, n: usize) -> Vec<u32>\` … f を n 回呼んで、結果を Vec に集める。

\`\`\`rust
call_n(make_counter(), 3)  // [1, 2, 3]
\`\`\`

- FnMut を呼ぶには、クロージャを持つ変数が \`mut\` でなければならない（引数なら \`mut f: F\`）
- 2 つのカウンタは **別々の状態** を持つ`,
    hints: [
      "`let mut count = 0; move || { count += 1; count }`",
      "call_n は `let mut v = Vec::new(); for _ in 0..n { v.push(f()); } v`",
    ],
  },
  initialCode: `fn make_counter() -> impl FnMut() -> u32 {
    let mut count = 0;
    move || todo!()
}

fn call_n<F: FnMut() -> u32>(mut f: F, n: usize) -> Vec<u32> {
    todo!()
}
`,
  solutionCode: `fn make_counter() -> impl FnMut() -> u32 {
    let mut count = 0;
    move || {
        count += 1;
        count
    }
}

fn call_n<F: FnMut() -> u32>(mut f: F, n: usize) -> Vec<u32> {
    let mut v = Vec::new();
    for _ in 0..n {
        v.push(f());
    }
    v
}
`,
});
