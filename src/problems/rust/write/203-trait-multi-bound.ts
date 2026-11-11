import { defineProblem } from "../../../core/schemas";

export default defineProblem({
  id: "rust-trait-multi-bound",
  stage: "write",
  language: "rust",
  scenario: "rust",
  copy: {
    title: "複数のトレイト境界（+）を使う",
    prompt: `## やること

複数のトレイト境界を組み合わせた関数を 2 つ書こう。

- （1）\`max_label<T: PartialOrd + Display>(items: &[T]) -> String\`
- 最大の要素を \`"max = {}"\` の形で返す（Display で表示）
- 空なら \`"empty"\`
- （2）\`labeled<T, U>(a: T, b: U) -> String\`（where 句で \`T: Display, U: Debug\`）
- \`"{a} / {b:?}"\` の形で返す（a は Display、b は Debug 表示）

\`\`\`rust
max_label(&[3, 9, 4])           // "max = 9"
max_label(&["pear", "apple"])   // "max = pear"
labeled("x", "y")               // "x / \\"y\\""
labeled(1.5, vec![1, 2])        // "1.5 / [1, 2]"
\`\`\`

- \`{}\` を使うには \`Display\`、\`{:?}\` を使うには \`Debug\`、\`>\` を使うには \`PartialOrd\` の境界が必要
- \`T\` は Copy とは限らないので、最大値は **参照** \`&T\` のまま持つとよい`,
    hints: [
      "`let mut max = &items[0];` で参照を持ち、`for x in items { if x > max { max = x; } }`",
      '空チェックは `if items.is_empty() { return String::from("empty"); }`',
      "`use std::fmt::{Debug, Display};` が必要",
    ],
  },
  initialCode: `use std::fmt::{Debug, Display};

fn max_label<T: PartialOrd + Display>(items: &[T]) -> String {
    todo!()
}

fn labeled<T, U>(a: T, b: U) -> String
where
    T: Display,
    U: Debug,
{
    todo!()
}
`,
  solutionCode: `use std::fmt::{Debug, Display};

fn max_label<T: PartialOrd + Display>(items: &[T]) -> String {
    if items.is_empty() {
        return String::from("empty");
    }
    let mut max = &items[0];
    for x in items {
        if x > max {
            max = x;
        }
    }
    format!("max = {}", max)
}

fn labeled<T, U>(a: T, b: U) -> String
where
    T: Display,
    U: Debug,
{
    format!("{} / {:?}", a, b)
}
`,
});
