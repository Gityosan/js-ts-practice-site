import { defineProblem } from "../../../core/schemas";

export default defineProblem({
  id: "rust-month-days-array",
  stage: "write",
  language: "rust",
  scenario: "rust",
  copy: {
    title: "配列で月の日数を引く",
    prompt: `## やること

月の番号（1〜12）を受け取り、その月の日数を返す関数 \`days_in_month\` を書こう（うるう年は考えず、2 月は 28 日とする）。

\`\`\`rust
days_in_month(1)    // 31
days_in_month(2)    // 28
days_in_month(4)    // 30
\`\`\`

## ポイント

各月の日数を **配列** に入れておき、添字で引くと \`if\` を何個も書かずに済む。

\`\`\`rust
let days = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
\`\`\`

- 月は 1 から、添字は 0 から始まるので **1 ずらす** 必要がある
- 添字の型は \`usize\`。引数 \`month\` は最初から \`usize\` にしてある
- 範囲外（13 など）を渡すと panic するが、今回は 1〜12 だけが来ると仮定してよい`,
    hints: ["配列を `let days: [u32; 12] = [...];` と書く", "`days[month - 1]` を返す"],
  },
  initialCode: `fn days_in_month(month: usize) -> u32 {
    todo!()
}
`,
  solutionCode: `fn days_in_month(month: usize) -> u32 {
    let days: [u32; 12] = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    days[month - 1]
}
`,
});
