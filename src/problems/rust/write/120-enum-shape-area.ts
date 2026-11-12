import { defineProblem } from "../../../core/schemas";

export default defineProblem({
  id: "rust-enum-shape-area",
  stage: "write",
  language: "rust",
  scenario: "rust",
  copy: {
    title: "Shape enum の面積と周の長さ",
    prompt: `## やること

図形を表す enum \`Shape\` に 2 つのメソッドを実装しよう。

\`\`\`rust
enum Shape {
    Circle { radius: f64 },
    Rectangle { width: f64, height: f64 },
    Triangle(f64, f64, f64),   // 3 辺の長さ
}
\`\`\`

- \`area(&self) -> f64\` … 面積。円は π r²（\`std::f64::consts::PI\`）、長方形は 幅×高さ、三角形は **ヘロンの公式**（s = (a+b+c)/2、面積 = √(s(s−a)(s−b)(s−c))）
- \`perimeter(&self) -> f64\` … 周の長さ。円は 2πr

\`\`\`rust
Shape::Rectangle { width: 3.0, height: 4.0 }.area();  // 12.0
Shape::Triangle(3.0, 4.0, 5.0).area();                // 6.0
\`\`\`

バリアントのデータは \`match self { Shape::Circle { radius } => ..., Shape::Triangle(a, b, c) => ... }\` で取り出す。
\`self\` は参照なので、取り出した \`radius\` なども \`&f64\` になる。計算では \`*radius\` と参照外しするか、そのまま演算してもよい（\`&f64 * &f64\` も定義されている）。`,
    hints: [
      "`match self { Shape::Circle { radius } => PI * radius * radius, ... }`",
      "三角形: `let s = (a + b + c) / 2.0; (s * (s - a) * (s - b) * (s - c)).sqrt()`",
      "`use std::f64::consts::PI;` をファイル先頭に書くと `PI` で使える",
    ],
  },
  initialCode: `use std::f64::consts::PI;

#[derive(Debug)]
enum Shape {
    Circle { radius: f64 },
    Rectangle { width: f64, height: f64 },
    Triangle(f64, f64, f64),
}

impl Shape {
    fn area(&self) -> f64 {
        todo!()
    }

    fn perimeter(&self) -> f64 {
        todo!()
    }
}
`,
  solutionCode: `use std::f64::consts::PI;

#[derive(Debug)]
enum Shape {
    Circle { radius: f64 },
    Rectangle { width: f64, height: f64 },
    Triangle(f64, f64, f64),
}

impl Shape {
    fn area(&self) -> f64 {
        match self {
            Shape::Circle { radius } => PI * radius * radius,
            Shape::Rectangle { width, height } => width * height,
            Shape::Triangle(a, b, c) => {
                let s = (a + b + c) / 2.0;
                (s * (s - a) * (s - b) * (s - c)).sqrt()
            }
        }
    }

    fn perimeter(&self) -> f64 {
        match self {
            Shape::Circle { radius } => 2.0 * PI * radius,
            Shape::Rectangle { width, height } => 2.0 * (width + height),
            Shape::Triangle(a, b, c) => a + b + c,
        }
    }
}
`,
});
