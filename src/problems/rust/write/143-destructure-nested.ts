import { defineProblem } from "../../../core/schemas";

export default defineProblem({
  id: "rust-destructure-nested",
  stage: "write",
  language: "rust",
  scenario: "rust",
  copy: {
    title: "ネストした分割代入と参照パターン",
    prompt: `## やること

図形エディタのイベントを処理する。

\`\`\`rust
struct Point { x: i32, y: i32 }
enum Shape {
    Circle { center: Point, r: u32 },
    Line(Point, Point),
}
\`\`\`

- \`describe(s: &Shape) -> String\` … ネストしたパターンで中まで一気に取り出す
  - 中心が原点 \`(0, 0)\` の円 → \`"原点の円 r=5"\`
  - それ以外の円 → \`"円 (1,2) r=5"\`
  - 水平な線（2 点の y が同じ） → \`"水平線 長さ=4"\`（長さは x の差の絶対値）
  - それ以外の線 → \`"線 (0,0)-(3,4)"\`
- \`sum_pairs(pairs: &[(i32, i32)]) -> (i32, i32)\` … 組ごとに足した合計。\`for &(a, b) in pairs\` のように **参照パターン** で取り出そう
- \`swap_xy(p: Point) -> Point\` … \`let Point { x, y } = p;\` で分解して x と y を入れ替えた点を返す

\`\`\`rust
describe(&Shape::Circle { center: Point { x: 0, y: 0 }, r: 5 });  // "原点の円 r=5"
sum_pairs(&[(1, 2), (3, 4)]);  // (4, 6)
\`\`\``,
    hints: [
      '`Shape::Circle { center: Point { x: 0, y: 0 }, r } => format!("原点の円 r={r}")`',
      "水平線: `Shape::Line(Point { x: x1, y: y1 }, Point { x: x2, y: y2 }) if y1 == y2 => ...`",
      "絶対値は `(x2 - x1).abs()`",
      "swap_xy: `Point { x: y, y: x }`",
    ],
  },
  initialCode: `#[derive(Debug)]
struct Point {
    x: i32,
    y: i32,
}

#[derive(Debug)]
enum Shape {
    Circle { center: Point, r: u32 },
    Line(Point, Point),
}

fn describe(s: &Shape) -> String {
    todo!()
}

fn sum_pairs(pairs: &[(i32, i32)]) -> (i32, i32) {
    todo!()
}

fn swap_xy(p: Point) -> Point {
    todo!()
}
`,
  solutionCode: `#[derive(Debug)]
struct Point {
    x: i32,
    y: i32,
}

#[derive(Debug)]
enum Shape {
    Circle { center: Point, r: u32 },
    Line(Point, Point),
}

fn describe(s: &Shape) -> String {
    match s {
        Shape::Circle { center: Point { x: 0, y: 0 }, r } => format!("原点の円 r={r}"),
        Shape::Circle { center: Point { x, y }, r } => format!("円 ({x},{y}) r={r}"),
        Shape::Line(Point { x: x1, y: y1 }, Point { x: x2, y: y2 }) if y1 == y2 => {
            format!("水平線 長さ={}", (x2 - x1).abs())
        }
        Shape::Line(Point { x: x1, y: y1 }, Point { x: x2, y: y2 }) => {
            format!("線 ({x1},{y1})-({x2},{y2})")
        }
    }
}

fn sum_pairs(pairs: &[(i32, i32)]) -> (i32, i32) {
    let mut sa = 0;
    let mut sb = 0;
    for &(a, b) in pairs {
        sa += a;
        sb += b;
    }
    (sa, sb)
}

fn swap_xy(p: Point) -> Point {
    let Point { x, y } = p;
    Point { x: y, y: x }
}
`,
});
