import { defineProblem } from "../../../core/schemas";

export default defineProblem({
  id: "rust-rectangle-area",
  stage: "write",
  language: "rust",
  scenario: "rust",
  copy: {
    title: "長方形の構造体: area と can_hold",
    prompt: `## やること

長方形を表す構造体 \`Rectangle\` にメソッドを 2 つ実装しよう。

- \`area(&self) -> u32\` … 面積（幅 × 高さ）
- \`can_hold(&self, other: &Rectangle) -> bool\` … 自分の中に \`other\` が **すっぽり入る**（幅も高さも \`other\` より **大きい**）なら \`true\`

\`\`\`rust
let a = Rectangle { width: 8, height: 7 };
let b = Rectangle { width: 5, height: 1 };
a.area();        // 56
a.can_hold(&b);  // true
b.can_hold(&a);  // false
\`\`\`

- メソッドは \`impl Rectangle { ... }\` の中に書く
- 自分のフィールドは \`self.width\` のように読む
- 読むだけなので第 1 引数は \`&self\``,
    hints: [
      "面積は `self.width * self.height`",
      "`can_hold` は `self.width > other.width && self.height > other.height`",
      "同じ大きさのときは「大きい」ではないので false",
    ],
  },
  initialCode: `#[derive(Debug)]
struct Rectangle {
    width: u32,
    height: u32,
}

impl Rectangle {
    fn area(&self) -> u32 {
        todo!()
    }

    fn can_hold(&self, other: &Rectangle) -> bool {
        todo!()
    }
}
`,
  solutionCode: `#[derive(Debug)]
struct Rectangle {
    width: u32,
    height: u32,
}

impl Rectangle {
    fn area(&self) -> u32 {
        self.width * self.height
    }

    fn can_hold(&self, other: &Rectangle) -> bool {
        self.width > other.width && self.height > other.height
    }
}
`,
});
