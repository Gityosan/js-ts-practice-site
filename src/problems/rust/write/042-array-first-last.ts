import { defineProblem } from "../../../core/schemas";

export default defineProblem({
  id: "rust-array-first-last",
  stage: "write",
  language: "rust",
  scenario: "rust",
  copy: {
    title: "配列の先頭・末尾と合計",
    prompt: `## やること

要素が 5 個の配列 \`[i32; 5]\` を扱う 2 つの関数を書こう。

### first_last(a)

先頭と末尾の要素を \`(先頭, 末尾)\` で返す。末尾は **\`a.len()\` を使って** 取り出してみよう。

\`\`\`rust
first_last([10, 20, 30, 40, 50])   // (10, 50)
\`\`\`

### sum_even_positions(a)

添字が偶数（0, 2, 4 番目）の要素の合計を返す。

\`\`\`rust
sum_even_positions([1, 2, 3, 4, 5])   // 1 + 3 + 5 = 9
\`\`\`

## ポイント

- 添字は 0 から: \`a[0]\` が先頭
- 末尾は \`a[a.len() - 1]\`（\`len()\` は 5 なので最後の添字は 4）
- ループはまだ使わなくてよい（要素数が決まっているので直接書ける）`,
    hints: ["`(a[0], a[a.len() - 1])`", "`a[0] + a[2] + a[4]`"],
  },
  initialCode: `fn first_last(a: [i32; 5]) -> (i32, i32) {
    todo!()
}

fn sum_even_positions(a: [i32; 5]) -> i32 {
    todo!()
}
`,
  solutionCode: `fn first_last(a: [i32; 5]) -> (i32, i32) {
    (a[0], a[a.len() - 1])
}

fn sum_even_positions(a: [i32; 5]) -> i32 {
    a[0] + a[2] + a[4]
}
`,
});
