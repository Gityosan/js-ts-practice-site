import { defineProblem } from "../../../core/schemas";

export default defineProblem({
  id: "rust-point-distance",
  stage: "write",
  language: "rust",
  scenario: "rust",
  copy: {
    title: "Point の new・距離・移動",
    prompt: `## やること

2 次元の点 \`Point\`（\`x: f64, y: f64\`）に次を実装しよう。

- 関連関数 \`new(x: f64, y: f64) -> Point\` … 点を作る（**フィールド初期化省略記法** を使ってみよう）
- 関連関数 \`origin() -> Point\` … 原点 (0, 0)
- メソッド \`distance(&self, other: &Point) -> f64\` … 2 点間の距離 √((x1−x2)² + (y1−y2)²)
- メソッド \`translate(&mut self, dx: f64, dy: f64)\` … 自分を (dx, dy) だけ動かす

\`\`\`rust
let mut p = Point::new(3.0, 4.0);
p.distance(&Point::origin());  // 5.0
p.translate(1.0, -1.0);        // p は Point { x: 4.0, y: 3.0 }
\`\`\`

- 平方根は \`f64\` のメソッド \`.sqrt()\`、2 乗は \`v * v\` か \`v.powi(2)\`
- \`Self\` は impl している型（ここでは Point）の別名`,
    hints: [
      "`fn new(x: f64, y: f64) -> Self { Self { x, y } }`",
      "距離は `let dx = self.x - other.x;` などを作ってから `(dx * dx + dy * dy).sqrt()`",
      "translate は `self.x += dx;` のように書き換える（`&mut self` なので可能）",
    ],
  },
  initialCode: `#[derive(Debug)]
struct Point {
    x: f64,
    y: f64,
}

impl Point {
    fn new(x: f64, y: f64) -> Point {
        todo!()
    }

    fn origin() -> Point {
        todo!()
    }

    fn distance(&self, other: &Point) -> f64 {
        todo!()
    }

    fn translate(&mut self, dx: f64, dy: f64) {
        todo!()
    }
}
`,
  solutionCode: `#[derive(Debug)]
struct Point {
    x: f64,
    y: f64,
}

impl Point {
    fn new(x: f64, y: f64) -> Point {
        Point { x, y }
    }

    fn origin() -> Point {
        Self::new(0.0, 0.0)
    }

    fn distance(&self, other: &Point) -> f64 {
        let dx = self.x - other.x;
        let dy = self.y - other.y;
        (dx * dx + dy * dy).sqrt()
    }

    fn translate(&mut self, dx: f64, dy: f64) {
        self.x += dx;
        self.y += dy;
    }
}
`,
});
