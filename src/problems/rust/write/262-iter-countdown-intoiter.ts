import { defineProblem } from "../../../core/schemas";

export default defineProblem({
  id: "rust-iter-countdown-intoiter",
  stage: "write",
  language: "rust",
  scenario: "rust",
  copy: {
    title: "Countdown 型を IntoIterator にして for で回す",
    prompt: `## やること

\`Countdown(n)\` を \`for\` で回すと n, n-1, …, 1 が出てくるようにしよう。

\`\`\`rust
for x in Countdown(3) {
    // 3, 2, 1
}
\`\`\`

\`Countdown\` 自体はイテレータではなく、**\`IntoIterator\` を実装** して、イテレータ \`CountdownIter\` に変換する。

- （1）\`impl Iterator for CountdownIter\` … n から 1 までを返す（0 になったら None）
- （2）\`impl IntoIterator for Countdown\` … \`type Item = u32;\`、\`type IntoIter = CountdownIter;\`、\`into_iter\` で CountdownIter を作る
- （3）\`launch(n: u32) -> String\` … \`for\` で Countdown(n) を回し、\`"3 2 1 Liftoff!"\` のような文字列を作る（n = 0 なら \`"Liftoff!"\`）

\`\`\`rust
launch(3)  // "3 2 1 Liftoff!"
Countdown(4).into_iter().sum::<u32>()  // 10
\`\`\``,
    hints: [
      "CountdownIter::next: `if self.n == 0 { None } else { self.n -= 1; Some(self.n + 1) }`",
      "into_iter: `CountdownIter { n: self.0 }`",
      'launch: `let mut s = String::new(); for x in Countdown(n) { s.push_str(&format!("{} ", x)); } s.push_str("Liftoff!"); s`',
    ],
  },
  initialCode: `struct Countdown(u32);

struct CountdownIter {
    n: u32,
}

impl Iterator for CountdownIter {
    type Item = u32;

    fn next(&mut self) -> Option<u32> {
        todo!()
    }
}

impl IntoIterator for Countdown {
    type Item = u32;
    type IntoIter = CountdownIter;

    fn into_iter(self) -> CountdownIter {
        todo!()
    }
}

fn launch(n: u32) -> String {
    todo!()
}
`,
  solutionCode: `struct Countdown(u32);

struct CountdownIter {
    n: u32,
}

impl Iterator for CountdownIter {
    type Item = u32;

    fn next(&mut self) -> Option<u32> {
        if self.n == 0 {
            None
        } else {
            self.n -= 1;
            Some(self.n + 1)
        }
    }
}

impl IntoIterator for Countdown {
    type Item = u32;
    type IntoIter = CountdownIter;

    fn into_iter(self) -> CountdownIter {
        CountdownIter { n: self.0 }
    }
}

fn launch(n: u32) -> String {
    let mut s = String::new();
    for x in Countdown(n) {
        s.push_str(&format!("{} ", x));
    }
    s.push_str("Liftoff!");
    s
}
`,
});
