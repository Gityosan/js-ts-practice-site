import { defineProblem } from "../../../core/schemas";

export default defineProblem({
  id: "rust-fix-semicolon-return",
  stage: "write",
  language: "rust",
  scenario: "rust",
  copy: {
    title: "【エラーを直す】セミコロンで値が消える",
    prompt: `## やること

初期コードは **コンパイルエラー（E0308: mismatched types）** になる。直して正しく動くようにしよう。

- \`celsius_to_kelvin(c)\` … 摂氏に 273 を足してケルビンにする
- \`double_then_inc(x)\` … 2 倍して 1 を足す

\`\`\`rust
celsius_to_kelvin(0)    // 273
double_then_inc(5)      // 11
\`\`\`

## ヒントになる知識

- **関数の最後の式** が戻り値になる
- 式の後ろに \`;\` を付けると **文** になり、値は捨てられて \`()\` になる
- エラーメッセージの \`help: remove this semicolon\` をよく読もう`,
    hints: [
      "エラーの `expected i32, found ()` は「i32 を返すはずなのに () を返している」という意味",
      "最後の行の `;` を消す",
    ],
  },
  initialCode: `fn celsius_to_kelvin(c: i32) -> i32 {
    c + 273;
}

fn double_then_inc(x: i32) -> i32 {
    let doubled = x * 2;
    doubled + 1;
}
`,
  solutionCode: `fn celsius_to_kelvin(c: i32) -> i32 {
    c + 273
}

fn double_then_inc(x: i32) -> i32 {
    let doubled = x * 2;
    doubled + 1
}
`,
});
