import { defineProblem } from "../../../core/schemas";

export default defineProblem({
  id: "rust-iter-windows-chunks",
  stage: "write",
  language: "rust",
  scenario: "rust",
  copy: {
    title: "windows と chunks で隣同士・区切りを扱う",
    prompt: `## やること

- （1）\`count_increases(v: &[i32]) -> usize\` … 前の値より **増えた** 回数
- （2）\`chunk_sums(v: &[i32], size: usize) -> Vec<i32>\` … size 個ずつに区切ったそれぞれの合計（最後は余りでもよい）
- （3）\`is_sorted_asc(v: &[i32]) -> bool\` … 昇順（隣同士で前 <= 後）になっているか。要素が 0 個・1 個なら true

\`\`\`rust
count_increases(&[199, 200, 208, 210, 200, 207])  // 4
chunk_sums(&[1, 2, 3, 4, 5], 2)                   // [3, 7, 5]
is_sorted_asc(&[1, 2, 2, 5])                      // true
\`\`\`

- \`v.windows(2)\` … \`[v[0], v[1]]\`, \`[v[1], v[2]]\`, … と **重なりながら** 1 つずつずれる部分スライス
- \`v.chunks(n)\` … **重ならずに** n 個ずつ区切った部分スライス（最後は短いこともある）
- それぞれの要素は \`&[i32]\` なので \`w[0]\`, \`w[1]\` や \`c.iter().sum()\` が使える`,
    hints: [
      "`v.windows(2).filter(|w| w[1] > w[0]).count()`",
      "`v.chunks(size).map(|c| c.iter().sum()).collect()`",
      "`v.windows(2).all(|w| w[0] <= w[1])`（空のとき all は true）",
    ],
  },
  initialCode: `fn count_increases(v: &[i32]) -> usize {
    todo!()
}

fn chunk_sums(v: &[i32], size: usize) -> Vec<i32> {
    todo!()
}

fn is_sorted_asc(v: &[i32]) -> bool {
    todo!()
}
`,
  solutionCode: `fn count_increases(v: &[i32]) -> usize {
    v.windows(2).filter(|w| w[1] > w[0]).count()
}

fn chunk_sums(v: &[i32], size: usize) -> Vec<i32> {
    v.chunks(size).map(|c| c.iter().sum()).collect()
}

fn is_sorted_asc(v: &[i32]) -> bool {
    v.windows(2).all(|w| w[0] <= w[1])
}
`,
});
