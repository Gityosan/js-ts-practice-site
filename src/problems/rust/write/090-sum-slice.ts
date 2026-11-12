import { defineProblem } from "../../../core/schemas";

export default defineProblem({
  id: "rust-sum-slice",
  stage: "write",
  language: "rust",
  scenario: "rust",
  copy: {
    title: "&[i32] を受け取って合計する",
    prompt: `## やること

整数のスライス \`&[i32]\` を受け取る関数を 2 つ書こう。

- \`sum(nums)\` … 全要素の合計（空なら 0）
- \`count_positive(nums)\` … 0 より大きい要素の個数

\`\`\`rust
sum(&[1, 2, 3])                 // 6
sum(&vec![10, 20])              // 30（Vec の参照も渡せる）
sum(&[1, 2, 3, 4, 5][1..4])     // 9（一部だけ渡す）
count_positive(&[-1, 0, 2, 5])  // 2
\`\`\`

## ポイント

- \`&[i32]\` にしておくと、配列・Vec・その一部のどれでも受け取れる
- \`for n in nums { ... }\` で要素を順に取り出せる。\`n\` は \`&i32\`（参照）
- 参照の値を使うときは \`*n\`（足し算 \`total += n\` はそのままでも OK）`,
    hints: [
      "`let mut total = 0; for n in nums { total += n; } total`",
      "`if *n > 0 { count += 1; }`",
    ],
  },
  initialCode: `fn sum(nums: &[i32]) -> i32 {
    todo!()
}

fn count_positive(nums: &[i32]) -> usize {
    todo!()
}
`,
  solutionCode: `fn sum(nums: &[i32]) -> i32 {
    let mut total = 0;
    for n in nums {
        total += n;
    }
    total
}

fn count_positive(nums: &[i32]) -> usize {
    let mut count = 0;
    for n in nums {
        if *n > 0 {
            count += 1;
        }
    }
    count
}
`,
});
