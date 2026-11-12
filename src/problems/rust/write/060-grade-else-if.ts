import { defineProblem } from "../../../core/schemas";

export default defineProblem({
  id: "rust-grade-else-if",
  stage: "write",
  language: "rust",
  scenario: "rust",
  copy: {
    title: "点数から成績を付ける（if / else if）",
    prompt: `## やること

0〜100 の点数を受け取り、成績の文字を返す関数 \`grade\` を書こう。

| 点数 | 成績 |
|---|---|
| 90 以上 | \`'A'\` |
| 70 以上 90 未満 | \`'B'\` |
| 50 以上 70 未満 | \`'C'\` |
| 50 未満 | \`'F'\` |

\`\`\`rust
grade(95)   // 'A'
grade(70)   // 'B'
grade(49)   // 'F'
\`\`\`

## ポイント

- \`if 条件 { 値 } else if 条件 { 値 } else { 値 }\` 全体が 1 つの式になる
- 上から順に判定されるので、\`>= 90\` → \`>= 70\` → \`>= 50\` の順に書くと条件が簡単になる
- 各枝の値（\`'A'\` など）に \`;\` を付けない`,
    hints: ["`if score >= 90 { 'A' } else if score >= 70 { 'B' } ...`", "最後は `else { 'F' }`"],
  },
  initialCode: `fn grade(score: u32) -> char {
    todo!()
}
`,
  solutionCode: `fn grade(score: u32) -> char {
    if score >= 90 {
        'A'
    } else if score >= 70 {
        'B'
    } else if score >= 50 {
        'C'
    } else {
        'F'
    }
}
`,
});
