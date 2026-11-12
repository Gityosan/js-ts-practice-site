import { defineProblem } from "../../../core/schemas";

export default defineProblem({
  id: "rust-fix-borrow-conflict",
  stage: "write",
  language: "rust",
  scenario: "rust",
  copy: {
    title: "【エラーを直す】借用中に変更してしまう",
    prompt: `## やること

初期コードは **コンパイルエラー（E0502）** になる。直して正しく動くようにしよう。

関数 \`push_and_first(v, x)\` は、ベクタ \`v\` の **追加前の先頭要素** を覚えておき、\`v\` の末尾に \`x\` を追加してから、覚えておいた先頭要素を返したい。

\`\`\`rust
let mut v = vec![1, 2];
let f = push_and_first(&mut v, 3);
// f は 1、v は [1, 2, 3]
\`\`\`

\`v\` は空でないと仮定してよい。

## なぜエラーになる？

\`\`\`rust
let first = &v[0];  // v の中身を不変借用
v.push(x);          // 借用中なのに v を変更しようとした
*first              // ここで借用を使っている
\`\`\`

\`push\` でベクタのメモリが再確保されると、\`first\` は解放済みの場所を指してしまう。だから Rust は禁止する。

## 直し方のヒント

- \`i32\` は Copy 型。参照ではなく **値をコピーして** 持っておけば借用は発生しない
- または、参照を使い終わってから \`push\` するように順番を変える`,
    hints: [
      "`let first = v[0];`（`&` を外すとコピーになる）",
      "最後は `*first` ではなく `first` を返す",
    ],
  },
  initialCode: `fn push_and_first(v: &mut Vec<i32>, x: i32) -> i32 {
    let first = &v[0];
    v.push(x);
    *first
}
`,
  solutionCode: `fn push_and_first(v: &mut Vec<i32>, x: i32) -> i32 {
    let first = v[0];
    v.push(x);
    first
}
`,
});
