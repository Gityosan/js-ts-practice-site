import { defineProblem } from "../../../core/schemas";

export default defineProblem({
  id: "rust-trait-shape-generic",
  stage: "write",
  language: "rust",
  scenario: "rust",
  copy: {
    title: "Shape トレイトとジェネリック関数で面積合計",
    prompt: `## やること

図形のトレイト \`Shape\` を 2 つの型に実装し、トレイト境界を使ったジェネリック関数を 2 つ書こう。

\`\`\`rust
trait Shape {
    fn area(&self) -> f64;
    fn name(&self) -> String;
}
\`\`\`

| 型 | area | name |
|---|---|---|
| \`Rect { w, h }\` | w × h | \`"rect"\` |
| \`Triangle { base, height }\` | base × height ÷ 2 | \`"triangle"\` |

関数:

- （1）\`total_area<T: Shape>(shapes: &[T]) -> f64\` … 同じ型の図形のスライスの面積の合計
- （2）\`bigger_name<A, B>(a: &A, b: &B) -> String\` … 面積が大きいほうの name（同じなら a）。境界は **where 句** で \`A: Shape, B: Shape\` と書く

\`\`\`rust
total_area(&[Rect { w: 2.0, h: 3.0 }, Rect { w: 1.0, h: 1.0 }])  // 7.0
bigger_name(&Rect { w: 1.0, h: 1.0 }, &Triangle { base: 4.0, height: 2.0 })  // "triangle"
\`\`\`

\`bigger_name\` は A と B に別々の型パラメータを使うので、Rect と Triangle を比べられる。`,
    hints: [
      "`impl Shape for Rect { fn area(&self) -> f64 { self.w * self.h } ... }`",
      "total_area は `let mut sum = 0.0; for s in shapes { sum += s.area(); } sum`",
      "where 句: `fn bigger_name<A, B>(a: &A, b: &B) -> String where A: Shape, B: Shape { ... }`",
    ],
  },
  initialCode: `trait Shape {
    fn area(&self) -> f64;
    fn name(&self) -> String;
}

struct Rect {
    w: f64,
    h: f64,
}

struct Triangle {
    base: f64,
    height: f64,
}

impl Shape for Rect {
    fn area(&self) -> f64 {
        todo!()
    }
    fn name(&self) -> String {
        todo!()
    }
}

impl Shape for Triangle {
    fn area(&self) -> f64 {
        todo!()
    }
    fn name(&self) -> String {
        todo!()
    }
}

fn total_area<T: Shape>(shapes: &[T]) -> f64 {
    todo!()
}

fn bigger_name<A, B>(a: &A, b: &B) -> String
where
    A: Shape,
    B: Shape,
{
    todo!()
}
`,
  solutionCode: `trait Shape {
    fn area(&self) -> f64;
    fn name(&self) -> String;
}

struct Rect {
    w: f64,
    h: f64,
}

struct Triangle {
    base: f64,
    height: f64,
}

impl Shape for Rect {
    fn area(&self) -> f64 {
        self.w * self.h
    }
    fn name(&self) -> String {
        String::from("rect")
    }
}

impl Shape for Triangle {
    fn area(&self) -> f64 {
        self.base * self.height / 2.0
    }
    fn name(&self) -> String {
        String::from("triangle")
    }
}

fn total_area<T: Shape>(shapes: &[T]) -> f64 {
    let mut sum = 0.0;
    for s in shapes {
        sum += s.area();
    }
    sum
}

fn bigger_name<A, B>(a: &A, b: &B) -> String
where
    A: Shape,
    B: Shape,
{
    if a.area() >= b.area() { a.name() } else { b.name() }
}
`,
});
