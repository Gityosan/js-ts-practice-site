import { defineProblem } from "../../../core/schemas";

export default defineProblem({
  id: "rust-min-max-slice",
  stage: "write",
  language: "rust",
  scenario: "rust",
  copy: {
    title: "スライスの最小値と最大値をタプルで返す",
    prompt: `## やること

空でない整数スライスを受け取り、\`(最小値, 最大値)\` を返す関数 \`min_max\` を書こう。

\`\`\`rust
min_max(&[3, 1, 4, 1, 5, 9, 2])   // (1, 9)
min_max(&[42])                    // (42, 42)
min_max(&[-5, -2, -9])            // (-9, -2)
\`\`\`

空のスライスは渡されないと仮定してよい。

## ポイント

- 最初の要素 \`nums[0]\` で最小・最大を初期化してから、残りと比べていく
- 初期値を \`0\` にすると、全部負の数のときに間違える（よくあるバグ）
- \`for &n in nums\` と書くと、\`&i32\` を分解して \`n\` を \`i32\` として取り出せる
- （\`nums.iter().min()\` という便利メソッドもあるが、ここではループで書いてみよう）`,
    hints: [
      "`let mut lo = nums[0]; let mut hi = nums[0];`",
      "`for &n in nums { if n < lo { lo = n; } if n > hi { hi = n; } }`",
    ],
  },
  initialCode: `fn min_max(nums: &[i32]) -> (i32, i32) {
    todo!()
}
`,
  solutionCode: `fn min_max(nums: &[i32]) -> (i32, i32) {
    let mut lo = nums[0];
    let mut hi = nums[0];
    for &n in nums {
        if n < lo {
            lo = n;
        }
        if n > hi {
            hi = n;
        }
    }
    (lo, hi)
}
`,
});
