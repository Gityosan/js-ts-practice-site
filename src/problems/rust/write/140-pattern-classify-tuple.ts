import { defineProblem } from "../../../core/schemas";

export default defineProblem({
  id: "rust-pattern-classify-point",
  stage: "write",
  language: "rust",
  scenario: "rust",
  copy: {
    title: "タプルのパターンで点を分類する",
    prompt: `## やること

座標 \`(i32, i32)\` を受け取って、位置を文字列で返す \`classify(p: (i32, i32)) -> &'static str\` を書こう。
**if を使わず、match のタプルパターンだけで** 書いてみよう。

| 条件 | 返す文字列 |
|---|---|
| (0, 0) | \`"原点"\` |
| x が 0 | \`"y軸上"\` |
| y が 0 | \`"x軸上"\` |
| x も y も正 | \`"第1象限"\` |
| x 負・y 正 | \`"第2象限"\` |
| x も y も負 | \`"第3象限"\` |
| x 正・y 負 | \`"第4象限"\` |

さらに \`grade(score: u32) -> char\` を **範囲パターン** で書こう: 90〜100 → \`'A'\`、70〜89 → \`'B'\`、50〜69 → \`'C'\`、0〜49 → \`'D'\`、それ以外（101 以上）→ \`'?'\`。

\`\`\`rust
classify((0, 5));    // "y軸上"
classify((-2, -3));  // "第3象限"
grade(75);           // 'B'
\`\`\``,
    hints: [
      '`(0, 0) => "原点", (0, _) => "y軸上", (_, 0) => "x軸上"` を先に書く',
      "正は `1..`、負は `..0`（または `i32::MIN..=-1`）という範囲パターンで書ける",
      "grade: `90..=100 => 'A', 70..=89 => 'B', ...`",
    ],
  },
  initialCode: `fn classify(p: (i32, i32)) -> &'static str {
    todo!()
}

fn grade(score: u32) -> char {
    todo!()
}
`,
  solutionCode: `fn classify(p: (i32, i32)) -> &'static str {
    match p {
        (0, 0) => "原点",
        (0, _) => "y軸上",
        (_, 0) => "x軸上",
        (1.., 1..) => "第1象限",
        (..0, 1..) => "第2象限",
        (..0, ..0) => "第3象限",
        (1.., ..0) => "第4象限",
    }
}

fn grade(score: u32) -> char {
    match score {
        90..=100 => 'A',
        70..=89 => 'B',
        50..=69 => 'C',
        0..=49 => 'D',
        _ => '?',
    }
}
`,
});
