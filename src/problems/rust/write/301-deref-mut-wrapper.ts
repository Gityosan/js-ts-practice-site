import { defineProblem } from "../../../core/schemas";

export default defineProblem({
  id: "rust-deref-mut-wrapper",
  stage: "write",
  language: "rust",
  scenario: "rust",
  copy: {
    title: "DerefMut で中身を変更できるラッパー",
    prompt: `## やること

\`Vec<i32>\` を包んだ \`Tracked\` は、中身の \`Vec\` を **そのまま使える** うえに、何回 \`&mut\` で触られたかを数える。

\`\`\`rust
struct Tracked {
    inner: Vec<i32>,
    mut_count: usize,
}
\`\`\`

- \`Deref\`（\`Target = Vec<i32>\`）… \`&self.inner\` を返す
- \`DerefMut\` … \`mut_count\` を 1 増やしてから \`&mut self.inner\` を返す
- \`mut_count(&self) -> usize\` は用意済み

\`\`\`rust
let mut t = Tracked::new(vec![1, 2]);
t.push(3);            // Vec::push が使える（DerefMut 経由 → カウント +1）
t.len()               // 3（Deref 経由。カウントは増えない）
t[0] = 10;            // IndexMut も DerefMut 経由 → +1
t.mut_count()         // 2
sum(&t)               // 15  （&Tracked → &Vec<i32> → &[i32]）
\`\`\``,
    hints: [
      "`impl Deref for Tracked { type Target = Vec<i32>; fn deref(&self) -> &Vec<i32> { &self.inner } }`",
      "`impl DerefMut for Tracked { fn deref_mut(&mut self) -> &mut Vec<i32> { ... } }`（Target は書かない）",
      "`deref_mut` の中で `self.mut_count += 1;` してから `&mut self.inner` を返す。",
    ],
  },
  initialCode: `use std::ops::{Deref, DerefMut};

struct Tracked {
    inner: Vec<i32>,
    mut_count: usize,
}

impl Tracked {
    fn new(inner: Vec<i32>) -> Tracked {
        Tracked { inner, mut_count: 0 }
    }

    fn mut_count(&self) -> usize {
        self.mut_count
    }
}

// ここに Deref と DerefMut を実装する

fn sum(xs: &[i32]) -> i32 {
    xs.iter().sum()
}
`,
  solutionCode: `use std::ops::{Deref, DerefMut};

struct Tracked {
    inner: Vec<i32>,
    mut_count: usize,
}

impl Tracked {
    fn new(inner: Vec<i32>) -> Tracked {
        Tracked { inner, mut_count: 0 }
    }

    fn mut_count(&self) -> usize {
        self.mut_count
    }
}

impl Deref for Tracked {
    type Target = Vec<i32>;

    fn deref(&self) -> &Vec<i32> {
        &self.inner
    }
}

impl DerefMut for Tracked {
    fn deref_mut(&mut self) -> &mut Vec<i32> {
        self.mut_count += 1;
        &mut self.inner
    }
}

fn sum(xs: &[i32]) -> i32 {
    xs.iter().sum()
}
`,
});
