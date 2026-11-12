import { defineProblem } from "../../../core/schemas";

export default defineProblem({
  id: "rust-add",
  stage: "write",
  language: "rust",
  scenario: "rust",
  copy: {
    title: "2 つの数を足す関数",
    prompt: `## やること

2 つの \`i32\` を受け取って和を返す関数 \`add\` を書こう。

\`\`\`rust
fn add(a: i32, b: i32) -> i32 {
    // ここ
}
\`\`\`

- 引数には **型が必須**（\`a: i32\`）
- \`-> i32\` は戻り値の型
- 最後の式に \`;\` を付けないと、それが **戻り値** になる（\`return\` 不要）

## 採点

\`fn main\` は書かなくてよい。採点側が \`add(2, 3)\` などを呼んで結果を確かめる。`,
    hints: ["`a + b` と書くだけ（`;` を付けない）", "`return a + b;` でも OK"],
  },
  initialCode: `fn add(a: i32, b: i32) -> i32 {
    todo!()
}
`,
  solutionCode: `fn add(a: i32, b: i32) -> i32 {
    a + b
}
`,
});
