import { defineProblem } from "../../../core/schemas";

export default defineProblem({
  id: "rust-macro-std-builtins",
  stage: "write",
  language: "rust",
  scenario: "rust",
  copy: {
    title: "matches! / assert! / unreachable! を使いこなす",
    prompt: `## やること

標準マクロを使って 3 つの関数を書こう。

### \`is_weekend(day: &str) -> bool\`

\`matches!\` を使い、\`"sat"\` か \`"sun"\` なら \`true\`。

### \`classify(n: i32) -> &'static str\`

\`match n.signum()\` で分け、\`1\` → \`"positive"\`、\`-1\` → \`"negative"\`、\`0\` → \`"zero"\`。それ以外は来ないはずなので \`_ => unreachable!()\` と書く。

### \`percent(part: u32, whole: u32) -> u32\`

\`part * 100 / whole\` を返す。ただし最初に次の 2 つを \`assert!\` で確かめ、破っていたら panic させる。

- \`whole > 0\`（メッセージ: \`"whole は 0 より大きい必要があります"\`）
- \`part <= whole\`

採点では panic することも確かめる（\`std::panic::catch_unwind\` で）。`,
    hints: [
      '`matches!(day, "sat" | "sun")`',
      '`assert!(whole > 0, "whole は 0 より大きい必要があります");`',
      "`assert!(part <= whole);` の後で `part * 100 / whole`",
    ],
  },
  initialCode: `fn is_weekend(day: &str) -> bool {
    todo!()
}

fn classify(n: i32) -> &'static str {
    todo!()
}

fn percent(part: u32, whole: u32) -> u32 {
    todo!()
}
`,
  solutionCode: `fn is_weekend(day: &str) -> bool {
    matches!(day, "sat" | "sun")
}

fn classify(n: i32) -> &'static str {
    match n.signum() {
        1 => "positive",
        -1 => "negative",
        0 => "zero",
        _ => unreachable!(),
    }
}

fn percent(part: u32, whole: u32) -> u32 {
    assert!(whole > 0, "whole は 0 より大きい必要があります");
    assert!(part <= whole);
    part * 100 / whole
}
`,
});
