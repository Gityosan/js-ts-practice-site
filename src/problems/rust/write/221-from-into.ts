import { defineProblem } from "../../../core/schemas";

export default defineProblem({
  id: "rust-from-into",
  stage: "write",
  language: "rust",
  scenario: "rust",
  copy: {
    title: "From を実装して Into でも使う",
    prompt: `## やること

2 つの \`From\` を実装しよう。

- （1）\`impl From<(i32, i32)> for Point\` … タプル \`(x, y)\` から Point を作る
- （2）\`impl From<Celsius> for Fahrenheit\` … 摂氏から華氏へ（F = C × 9 / 5 + 32）

\`\`\`rust
Point::from((1, 2))                          // Point { x: 1, y: 2 }
let p: Point = (3, 4).into();                // From を実装すると Into も使える
let f: Fahrenheit = Celsius(100.0).into();   // Fahrenheit(212.0)
\`\`\`

さらに \`impl Into<String>\` を引数に取る関数 \`label\` を書こう。\`&str\` でも \`String\` でも受け取れる。

\`\`\`rust
fn label(name: impl Into<String>) -> String   // "[" + name + "]"
label("a")                // "[a]"
label(String::from("b"))  // "[b]"
\`\`\``,
    hints: [
      "`impl From<(i32, i32)> for Point { fn from(t: (i32, i32)) -> Self { Point { x: t.0, y: t.1 } } }`",
      "華氏は `Fahrenheit(c.0 * 9.0 / 5.0 + 32.0)`",
      'label は `let s: String = name.into(); format!("[{}]", s)`',
    ],
  },
  initialCode: `#[derive(Debug)]
struct Point {
    x: i32,
    y: i32,
}

#[derive(Debug)]
struct Celsius(f64);

#[derive(Debug)]
struct Fahrenheit(f64);

impl From<(i32, i32)> for Point {
    fn from(t: (i32, i32)) -> Self {
        todo!()
    }
}

impl From<Celsius> for Fahrenheit {
    fn from(c: Celsius) -> Self {
        todo!()
    }
}

fn label(name: impl Into<String>) -> String {
    todo!()
}
`,
  solutionCode: `#[derive(Debug)]
struct Point {
    x: i32,
    y: i32,
}

#[derive(Debug)]
struct Celsius(f64);

#[derive(Debug)]
struct Fahrenheit(f64);

impl From<(i32, i32)> for Point {
    fn from(t: (i32, i32)) -> Self {
        Point { x: t.0, y: t.1 }
    }
}

impl From<Celsius> for Fahrenheit {
    fn from(c: Celsius) -> Self {
        Fahrenheit(c.0 * 9.0 / 5.0 + 32.0)
    }
}

fn label(name: impl Into<String>) -> String {
    let s: String = name.into();
    format!("[{}]", s)
}
`,
});
