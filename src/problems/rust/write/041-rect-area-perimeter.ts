import { defineProblem } from "../../../core/schemas";

export default defineProblem({
  id: "rust-rect-area-perimeter",
  stage: "write",
  language: "rust",
  scenario: "rust",
  copy: {
    title: "長方形の面積と周の長さをタプルで返す",
    prompt: `## やること

長方形の大きさ \`(幅, 高さ)\` をタプルで受け取り、\`(面積, 周の長さ)\` をタプルで返す関数 \`area_and_perimeter\` を書こう。

\`\`\`rust
area_and_perimeter((3, 4))    // (12, 14)
area_and_perimeter((5, 5))    // (25, 20)
\`\`\`

## ポイント

- 引数のタプルは \`let (w, h) = size;\` で分割すると読みやすい
- 関数の **引数の位置で直接分割** することもできる: \`fn f((w, h): (u32, u32))\`
- 面積 = 幅 × 高さ、周の長さ = 2 × (幅 + 高さ)`,
    hints: ["`let (w, h) = size;`", "`(w * h, 2 * (w + h))` を返す"],
  },
  initialCode: `fn area_and_perimeter(size: (u32, u32)) -> (u32, u32) {
    todo!()
}
`,
  solutionCode: `fn area_and_perimeter(size: (u32, u32)) -> (u32, u32) {
    let (w, h) = size;
    (w * h, 2 * (w + h))
}
`,
});
