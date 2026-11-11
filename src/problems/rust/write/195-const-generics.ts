import { defineProblem } from "../../../core/schemas";

export default defineProblem({
  id: "rust-const-generics",
  stage: "write",
  language: "rust",
  scenario: "rust",
  copy: {
    title: "const ジェネリクスで任意の長さの配列",
    prompt: `## やること

**const ジェネリクス** を使って、どんな長さの配列でも受け取れる関数を 2 つ書こう。

- （1）\`sum_array<const N: usize>(arr: [i32; N]) -> i32\` … 合計（長さ 0 なら 0）
- （2）\`first_last<T: Copy, const N: usize>(arr: [T; N]) -> Option<(T, T)>\` … 最初と最後の組。長さ 0 なら \`None\`

\`\`\`rust
sum_array([1, 2, 3])            // 6
sum_array([10, 20, 30, 40])     // 100
first_last(['a', 'b', 'c'])     // Some(('a', 'c'))
first_last([7])                 // Some((7, 7))
\`\`\`

- \`[i32; 3]\` と \`[i32; 4]\` は **別の型**。\`const N: usize\` で長さをパラメータにすると 1 つの関数で両方を受け取れる
- 関数の中では \`N\` を普通の定数（\`usize\`）として使える`,
    hints: [
      "`for x in arr { total += x; }` で合計できる（配列は値で for に渡せる）",
      "`if N == 0 { return None; }` で空を先に処理",
      "最初は `arr[0]`、最後は `arr[N - 1]`",
    ],
  },
  initialCode: `fn sum_array<const N: usize>(arr: [i32; N]) -> i32 {
    todo!()
}

fn first_last<T: Copy, const N: usize>(arr: [T; N]) -> Option<(T, T)> {
    todo!()
}
`,
  solutionCode: `fn sum_array<const N: usize>(arr: [i32; N]) -> i32 {
    let mut total = 0;
    for x in arr {
        total += x;
    }
    total
}

fn first_last<T: Copy, const N: usize>(arr: [T; N]) -> Option<(T, T)> {
    if N == 0 {
        return None;
    }
    Some((arr[0], arr[N - 1]))
}
`,
});
