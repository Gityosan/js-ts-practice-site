import { defineProblem } from "../../../core/schemas";

export default defineProblem({
  id: "rust-mut-ref-numbers",
  stage: "write",
  language: "rust",
  scenario: "rust",
  copy: {
    title: "&mut で数値を書き換える（参照外し *）",
    prompt: `## やること

可変参照を受け取り、参照先の値を書き換える関数を 2 つ書こう。戻り値はない。

### double_in_place(x)

\`x\` が指す値を 2 倍にする。

\`\`\`rust
let mut a = 5;
double_in_place(&mut a);
// a は 10
\`\`\`

### swap_values(a, b)

\`a\` と \`b\` が指す値を入れ替える。

\`\`\`rust
let mut x = 1;
let mut y = 2;
swap_values(&mut x, &mut y);
// x は 2、y は 1
\`\`\`

## ポイント

- \`&mut i32\` は「i32 への可変参照」
- 参照の **指している先** を読み書きするには \`*\` を付ける: \`*x = *x * 2;\` や \`*x *= 2;\`
- 入れ替えは一時変数を使う: \`let tmp = *a;\` → \`*a = *b;\` → \`*b = tmp;\`
- （標準ライブラリには \`std::mem::swap(a, b)\` もあるが、今回は自分で書いてみよう）`,
    hints: ["`*x *= 2;`", "`let tmp = *a; *a = *b; *b = tmp;`"],
  },
  initialCode: `fn double_in_place(x: &mut i32) {
    todo!()
}

fn swap_values(a: &mut i32, b: &mut i32) {
    todo!()
}
`,
  solutionCode: `fn double_in_place(x: &mut i32) {
    *x *= 2;
}

fn swap_values(a: &mut i32, b: &mut i32) {
    let tmp = *a;
    *a = *b;
    *b = tmp;
}
`,
});
