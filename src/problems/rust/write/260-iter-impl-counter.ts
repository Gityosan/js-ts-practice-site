import { defineProblem } from "../../../core/schemas";

export default defineProblem({
  id: "rust-iter-impl-counter",
  stage: "write",
  language: "rust",
  scenario: "rust",
  copy: {
    title: "Iterator を実装する: Counter",
    prompt: `## やること

\`start\` から \`end\` まで（end を含む）の整数を **step 刻み** で返すイテレータ \`Counter\` を作ろう。

\`\`\`rust
Counter::new(1, 10, 3).collect::<Vec<_>>()  // [1, 4, 7, 10]
Counter::new(5, 3, 1).collect::<Vec<_>>()   // []（start > end なら何も返さない）
\`\`\`

- （1）\`new(start: u32, end: u32, step: u32) -> Counter\`（step は 1 以上とする）
- （2）\`impl Iterator for Counter\` … \`type Item = u32;\` と \`next\`

\`next\` を実装すれば、\`sum\`・\`filter\`・\`collect\` などのメソッドが全部使えるようになる。

\`\`\`rust
Counter::new(1, 100, 1).sum::<u32>()                  // 5050
Counter::new(1, 10, 1).filter(|x| x % 2 == 0).count() // 5
\`\`\``,
    hints: [
      "フィールドは `current: u32, end: u32, step: u32` にするとよい",
      "next: `if self.current > self.end { return None; } let v = self.current; self.current += self.step; Some(v)`",
    ],
  },
  initialCode: `struct Counter {
    current: u32,
    end: u32,
    step: u32,
}

impl Counter {
    fn new(start: u32, end: u32, step: u32) -> Counter {
        todo!()
    }
}

impl Iterator for Counter {
    type Item = u32;

    fn next(&mut self) -> Option<u32> {
        todo!()
    }
}
`,
  solutionCode: `struct Counter {
    current: u32,
    end: u32,
    step: u32,
}

impl Counter {
    fn new(start: u32, end: u32, step: u32) -> Counter {
        Counter { current: start, end, step }
    }
}

impl Iterator for Counter {
    type Item = u32;

    fn next(&mut self) -> Option<u32> {
        if self.current > self.end {
            return None;
        }
        let v = self.current;
        self.current += self.step;
        Some(v)
    }
}
`,
});
