import { defineProblem } from "../../../core/schemas";

export default defineProblem({
  id: "rust-generic-point-impl",
  stage: "write",
  language: "rust",
  scenario: "rust",
  copy: {
    title: "Point<T> と特定の型だけの impl",
    prompt: `## やること

ジェネリックな構造体 \`Point<T>\` に、2 種類の impl を書こう。

- **すべての T 向け** \`impl<T> Point<T>\`:
- \`new(x: T, y: T) -> Point<T>\` … 作る
- \`swap(self) -> Point<T>\` … x と y を入れ替えた新しい Point を返す
- **f64 のときだけ** \`impl Point<f64>\`:
- \`distance_from_origin(&self) -> f64\` … 原点からの距離 √(x² + y²)

\`\`\`rust
Point::new(1, 2).swap()                       // Point { x: 2, y: 1 }
Point::new(3.0, 4.0).distance_from_origin()   // 5.0
\`\`\`

\`impl<T>\` の \`<T>\` は「この impl で T を使う」という宣言。\`impl Point<f64>\` は宣言なしで具体的な型を書く。`,
    hints: [
      "`impl<T> Point<T> { fn new(x: T, y: T) -> Self { Point { x, y } } }`",
      "swap は `Point { x: self.y, y: self.x }`（self を消費するので move してよい）",
      "距離は `(self.x * self.x + self.y * self.y).sqrt()`",
    ],
  },
  initialCode: `#[derive(Debug)]
struct Point<T> {
    x: T,
    y: T,
}

impl<T> Point<T> {
    fn new(x: T, y: T) -> Point<T> {
        todo!()
    }

    fn swap(self) -> Point<T> {
        todo!()
    }
}

impl Point<f64> {
    fn distance_from_origin(&self) -> f64 {
        todo!()
    }
}
`,
  solutionCode: `#[derive(Debug)]
struct Point<T> {
    x: T,
    y: T,
}

impl<T> Point<T> {
    fn new(x: T, y: T) -> Point<T> {
        Point { x, y }
    }

    fn swap(self) -> Point<T> {
        Point { x: self.y, y: self.x }
    }
}

impl Point<f64> {
    fn distance_from_origin(&self) -> f64 {
        (self.x * self.x + self.y * self.y).sqrt()
    }
}
`,
});
