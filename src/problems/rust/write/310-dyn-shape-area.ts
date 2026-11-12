import { defineProblem } from "../../../core/schemas";

export default defineProblem({
  id: "rust-dyn-shape-area",
  stage: "write",
  language: "rust",
  scenario: "rust",
  copy: {
    title: "Vec<Box<dyn Shape>> の面積合計",
    prompt: `## やること

トレイト \`Shape\` を \`Rect\`（長方形）・\`Circle\`（円）・\`Triangle\`（三角形）に実装し、まとめて扱う関数を書こう。

\`\`\`rust
trait Shape {
    fn area(&self) -> f64;
    fn name(&self) -> String;
}
\`\`\`

| 型 | area | name |
|---|---|---|
| \`Rect { w, h }\` | \`w * h\` | \`"rect"\` |
| \`Circle { r }\` | \`std::f64::consts::PI * r * r\` | \`"circle"\` |
| \`Triangle { base, height }\` | \`base * height / 2.0\` | \`"triangle"\` |

- \`total_area(shapes: &[Box<dyn Shape>]) -> f64\` … 面積の合計
- \`largest(shapes: &[Box<dyn Shape>]) -> Option<String>\` … 面積が最大の図形の \`name\`。空なら \`None\`

\`\`\`rust
let shapes: Vec<Box<dyn Shape>> = vec![
    Box::new(Rect { w: 2.0, h: 3.0 }),
    Box::new(Triangle { base: 4.0, height: 5.0 }),
];
total_area(&shapes) // 16.0
largest(&shapes)    // Some("triangle")
\`\`\``,
    hints: [
      "各型に `impl Shape for Rect { ... }` を書く。",
      "`shapes.iter().map(|s| s.area()).sum()`",
      "`largest` は `max_by(|a, b| a.area().partial_cmp(&b.area()).unwrap())` を使い、`.map(|s| s.name())`。f64 は `Ord` でないので `max_by_key` は使えない。",
    ],
  },
  initialCode: `trait Shape {
    fn area(&self) -> f64;
    fn name(&self) -> String;
}

struct Rect { w: f64, h: f64 }
struct Circle { r: f64 }
struct Triangle { base: f64, height: f64 }

// ここに 3 つの impl Shape を書く

fn total_area(shapes: &[Box<dyn Shape>]) -> f64 {
    todo!()
}

fn largest(shapes: &[Box<dyn Shape>]) -> Option<String> {
    todo!()
}
`,
  solutionCode: `trait Shape {
    fn area(&self) -> f64;
    fn name(&self) -> String;
}

struct Rect { w: f64, h: f64 }
struct Circle { r: f64 }
struct Triangle { base: f64, height: f64 }

impl Shape for Rect {
    fn area(&self) -> f64 { self.w * self.h }
    fn name(&self) -> String { "rect".to_string() }
}

impl Shape for Circle {
    fn area(&self) -> f64 { std::f64::consts::PI * self.r * self.r }
    fn name(&self) -> String { "circle".to_string() }
}

impl Shape for Triangle {
    fn area(&self) -> f64 { self.base * self.height / 2.0 }
    fn name(&self) -> String { "triangle".to_string() }
}

fn total_area(shapes: &[Box<dyn Shape>]) -> f64 {
    shapes.iter().map(|s| s.area()).sum()
}

fn largest(shapes: &[Box<dyn Shape>]) -> Option<String> {
    shapes
        .iter()
        .max_by(|a, b| a.area().partial_cmp(&b.area()).unwrap())
        .map(|s| s.name())
}
`,
});
