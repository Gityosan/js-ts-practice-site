import { defineProblem } from "../../../core/schemas";

export default defineProblem({
  id: "rust-slice-ranges",
  stage: "write",
  language: "rust",
  scenario: "rust",
  copy: {
    title: "範囲指定でスライスを切り出す",
    prompt: `## やること

スライスを **返す** 関数を 2 つ書こう。どちらも新しい Vec は作らず、元のスライスの一部を返す。

### middle(nums)

先頭と末尾を 1 つずつ除いた部分を返す。要素が 2 個以下なら空のスライスを返す。

\`\`\`rust
middle(&[1, 2, 3, 4, 5])   // [2, 3, 4]
middle(&[1, 2])            // []
\`\`\`

### halves(nums)

前半と後半に分けて \`(前半, 後半)\` で返す。奇数個のときは **後半の方を 1 つ多く** する。

\`\`\`rust
halves(&[1, 2, 3, 4])      // ([1, 2], [3, 4])
halves(&[1, 2, 3])         // ([1], [2, 3])
\`\`\`

## ポイント

- \`&nums[1..nums.len() - 1]\` で先頭と末尾を除ける
- 要素が 0 個のとき \`nums.len() - 1\` は usize の引き算であふれて panic するので、先に長さを確かめる
- 空のスライスは \`&[]\` か \`&nums[0..0]\`
- 真ん中の位置は \`nums.len() / 2\`。\`&nums[..mid]\` と \`&nums[mid..]\` に分ける`,
    hints: [
      "`if nums.len() <= 2 { return &[]; }`",
      "`let mid = nums.len() / 2; (&nums[..mid], &nums[mid..])`",
    ],
  },
  initialCode: `fn middle(nums: &[i32]) -> &[i32] {
    todo!()
}

fn halves(nums: &[i32]) -> (&[i32], &[i32]) {
    todo!()
}
`,
  solutionCode: `fn middle(nums: &[i32]) -> &[i32] {
    if nums.len() <= 2 {
        return &[];
    }
    &nums[1..nums.len() - 1]
}

fn halves(nums: &[i32]) -> (&[i32], &[i32]) {
    let mid = nums.len() / 2;
    (&nums[..mid], &nums[mid..])
}
`,
});
