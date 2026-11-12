import { defineProblem } from "../../../core/schemas";

export default defineProblem({
  id: "rust-test-assert-validate",
  stage: "write",
  language: "rust",
  scenario: "rust",
  copy: {
    title: "assert! で入力を検証する",
    prompt: `## やること

\`assert!\` はテスト専用ではなく、**普通のコードで前提条件を検査する** のにも使える（条件が偽なら panic）。
次の 2 つの関数で、不正な入力に対して **決められたメッセージで panic** させよう。

- \`Percent::new(value: i32) -> Percent\` … 0〜100 の範囲外なら \`assert!\` で panic。メッセージは \`"percent must be 0..=100, got 150"\` のように値を含める
- \`average(scores: &[u32]) -> u32\` … 空のスライスなら \`assert!\` で \`"scores must not be empty"\` という panic。そうでなければ平均（切り捨て）

\`\`\`rust
Percent::new(42).value()   // 42
Percent::new(150)          // panic: percent must be 0..=100, got 150
average(&[70, 80, 95])     // 81
average(&[])               // panic: scores must not be empty
\`\`\`

## 採点のしくみ（#[should_panic] 相当）

手元なら \`#[should_panic(expected = "got 150")]\` を付けたテストで確かめるところ。このサイトでは \`std::panic::catch_unwind\` で panic を捕まえ、**panic したか・メッセージが正しいか** を確かめる。`,
    hints: [
      '`assert!((0..=100).contains(&value), "percent must be 0..=100, got {}", value);`',
      '`assert!(!scores.is_empty(), "scores must not be empty");`',
      "平均は `scores.iter().sum::<u32>() / scores.len() as u32`。",
    ],
  },
  initialCode: `#[derive(Debug)]
struct Percent(i32);

impl Percent {
    fn new(value: i32) -> Percent {
        todo!()
    }

    fn value(&self) -> i32 {
        self.0
    }
}

fn average(scores: &[u32]) -> u32 {
    todo!()
}
`,
  solutionCode: `#[derive(Debug)]
struct Percent(i32);

impl Percent {
    fn new(value: i32) -> Percent {
        assert!((0..=100).contains(&value), "percent must be 0..=100, got {}", value);
        Percent(value)
    }

    fn value(&self) -> i32 {
        self.0
    }
}

fn average(scores: &[u32]) -> u32 {
    assert!(!scores.is_empty(), "scores must not be empty");
    scores.iter().sum::<u32>() / scores.len() as u32
}
`,
});
