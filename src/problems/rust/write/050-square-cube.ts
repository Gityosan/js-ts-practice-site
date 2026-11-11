import { defineProblem } from "../../../core/schemas";

export default defineProblem({
  id: "rust-square-cube",
  stage: "write",
  language: "rust",
  scenario: "rust",
  copy: {
    title: "関数から関数を呼ぶ（2 乗と 3 乗）",
    prompt: `## やること

2 つの関数を書こう。

- \`square(x)\` … \`x\` の 2 乗を返す
- \`cube(x)\` … \`x\` の 3 乗を返す。**\`square\` を呼び出して** 書いてみよう

\`\`\`rust
square(4)   // 16
cube(3)     // 27
cube(-2)    // -8
\`\`\`

型は \`i64\` を使う。

## ポイント

- 関数は他の関数を自由に呼べる（定義の順番は気にしなくてよい）
- 最後の式に \`;\` を付けない`,
    hints: ["`x * x`", "`square(x) * x`"],
  },
  initialCode: `fn square(x: i64) -> i64 {
    todo!()
}

fn cube(x: i64) -> i64 {
    todo!()
}
`,
  solutionCode: `fn square(x: i64) -> i64 {
    x * x
}

fn cube(x: i64) -> i64 {
    square(x) * x
}
`,
});
