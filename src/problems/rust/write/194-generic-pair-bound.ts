import { defineProblem } from "../../../core/schemas";

export default defineProblem({
  id: "rust-generic-pair-bound",
  stage: "write",
  language: "rust",
  scenario: "rust",
  copy: {
    title: "impl にトレイト境界: 比較できるときだけのメソッド",
    prompt: `## やること

2 つの値を持つ \`Pair<T>\` に、2 種類の impl を書こう。

- **すべての T 向け** \`impl<T> Pair<T>\`
- \`new(a: T, b: T) -> Pair<T>\`
- **比較できてコピーできる T だけ** \`impl<T: PartialOrd + Copy> Pair<T>\`
- \`larger(&self) -> T\` … 大きいほう（同じなら a）
- \`sorted(&self) -> (T, T)\` … (小さいほう, 大きいほう)

\`\`\`rust
Pair::new(3, 8).larger()     // 8
Pair::new(9, 1).sorted()     // (1, 9)
Pair::new('q', 'c').larger() // 'q'
\`\`\`

impl にトレイト境界を付けると、「その条件を満たす型のときだけ使えるメソッド」になる。
例えば \`Pair<Vec<i32>>\` は作れるが（\`new\` は使える）、\`Vec\` は \`Copy\` でないので \`larger\` は呼べない。`,
    hints: [
      "`impl<T: PartialOrd + Copy> Pair<T> { ... }` を別に書く",
      "`if self.a >= self.b { self.a } else { self.b }`",
      "sorted は `if self.a <= self.b { (self.a, self.b) } else { (self.b, self.a) }`",
    ],
  },
  initialCode: `struct Pair<T> {
    a: T,
    b: T,
}

impl<T> Pair<T> {
    fn new(a: T, b: T) -> Pair<T> {
        todo!()
    }
}

// ここに impl<T: PartialOrd + Copy> Pair<T> を書いて larger と sorted を実装しよう
impl<T: PartialOrd + Copy> Pair<T> {
    fn larger(&self) -> T {
        todo!()
    }

    fn sorted(&self) -> (T, T) {
        todo!()
    }
}
`,
  solutionCode: `struct Pair<T> {
    a: T,
    b: T,
}

impl<T> Pair<T> {
    fn new(a: T, b: T) -> Pair<T> {
        Pair { a, b }
    }
}

impl<T: PartialOrd + Copy> Pair<T> {
    fn larger(&self) -> T {
        if self.a >= self.b { self.a } else { self.b }
    }

    fn sorted(&self) -> (T, T) {
        if self.a <= self.b {
            (self.a, self.b)
        } else {
            (self.b, self.a)
        }
    }
}
`,
});
