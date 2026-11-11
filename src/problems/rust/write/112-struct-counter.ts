import { defineProblem } from "../../../core/schemas";

export default defineProblem({
  id: "rust-counter-struct",
  stage: "write",
  language: "rust",
  scenario: "rust",
  copy: {
    title: "Counter 構造体（&mut self で状態を更新）",
    prompt: `## やること

上限付きのカウンタ \`Counter\` を作ろう。

- \`Counter::new(max: u32) -> Counter\` … 値 0、上限 \`max\` で作る
- \`increment(&mut self) -> bool\` … 値を 1 増やして \`true\` を返す。ただし **すでに上限なら増やさず \`false\`**
- \`reset(&mut self)\` … 値を 0 に戻す
- \`value(&self) -> u32\` … 現在の値

\`\`\`rust
let mut c = Counter::new(2);
c.increment(); // true  (1)
c.increment(); // true  (2)
c.increment(); // false (2 のまま)
c.value();     // 2
\`\`\`

- 状態を変えるメソッドは \`&mut self\`、読むだけなら \`&self\`
- 呼ぶ側の変数も \`let mut c\` にする必要がある`,
    hints: [
      "フィールドは `count: u32` と `max: u32` の 2 つにすると良い",
      "`if self.count >= self.max { return false; }`",
      "最後に `self.count += 1; true`",
    ],
  },
  initialCode: `#[derive(Debug)]
struct Counter {
    count: u32,
    max: u32,
}

impl Counter {
    fn new(max: u32) -> Counter {
        todo!()
    }

    fn increment(&mut self) -> bool {
        todo!()
    }

    fn reset(&mut self) {
        todo!()
    }

    fn value(&self) -> u32 {
        todo!()
    }
}
`,
  solutionCode: `#[derive(Debug)]
struct Counter {
    count: u32,
    max: u32,
}

impl Counter {
    fn new(max: u32) -> Counter {
        Counter { count: 0, max }
    }

    fn increment(&mut self) -> bool {
        if self.count >= self.max {
            return false;
        }
        self.count += 1;
        true
    }

    fn reset(&mut self) {
        self.count = 0;
    }

    fn value(&self) -> u32 {
        self.count
    }
}
`,
});
