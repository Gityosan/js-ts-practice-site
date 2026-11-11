import { defineProblem } from "../../../core/schemas";

export default defineProblem({
  id: "rust-dyn-object-safety",
  stage: "write",
  language: "rust",
  scenario: "rust",
  copy: {
    title: "オブジェクト安全にする（エラーを直す）",
    prompt: `## やること（コンパイルエラーを直す問題）

初期コードは **コンパイルエラー** になる。トレイト \`Shape\` のメソッド \`duplicate(&self) -> Self\` が \`Self\` を返すため、\`dyn Shape\` にできない（E0038: not dyn compatible）からだ。

次のように直そう。

- \`duplicate\` を削除し、代わりに \`fn clone_box(&self) -> Box<dyn Shape>;\` をトレイトに置く
- \`Square\` と \`Circle\` に \`clone_box\` を実装する（自分のコピーを Box に入れて返す）
- \`duplicate_all(shapes: &[Box<dyn Shape>]) -> Vec<Box<dyn Shape>>\` … すべての図形を複製した新しい Vec を返す
- \`scale_all(shapes: &mut [Box<dyn Shape>], k: f64)\` … すべての図形を \`k\` 倍に拡大する（\`scale(&mut self, k)\` を呼ぶ）

\`\`\`rust
let original: Vec<Box<dyn Shape>> = vec![Box::new(Square { side: 2.0 })];
let mut copies = duplicate_all(&original);
scale_all(&mut copies, 3.0);
original[0].describe() // "square 2"（元はそのまま）
copies[0].describe()   // "square 6"
\`\`\``,
    hints: [
      "トレイトの `fn duplicate(&self) -> Self;` を `fn clone_box(&self) -> Box<dyn Shape>;` に書き換える。",
      "各型は `#[derive(Clone)]` 済みなので `Box::new(self.clone())` で返せる。",
      "`duplicate_all` は `shapes.iter().map(|s| s.clone_box()).collect()`、`scale_all` は `for s in shapes.iter_mut() { s.scale(k); }`。",
    ],
  },
  initialCode: `trait Shape {
    fn describe(&self) -> String;
    fn scale(&mut self, k: f64);
    fn duplicate(&self) -> Self;
}

#[derive(Clone)]
struct Square {
    side: f64,
}

#[derive(Clone)]
struct Circle {
    r: f64,
}

impl Shape for Square {
    fn describe(&self) -> String { format!("square {}", self.side) }
    fn scale(&mut self, k: f64) { self.side *= k; }
    fn duplicate(&self) -> Self { self.clone() }
}

impl Shape for Circle {
    fn describe(&self) -> String { format!("circle {}", self.r) }
    fn scale(&mut self, k: f64) { self.r *= k; }
    fn duplicate(&self) -> Self { self.clone() }
}

fn duplicate_all(shapes: &[Box<dyn Shape>]) -> Vec<Box<dyn Shape>> {
    todo!()
}

fn scale_all(shapes: &mut [Box<dyn Shape>], k: f64) {
    todo!()
}
`,
  solutionCode: `trait Shape {
    fn describe(&self) -> String;
    fn scale(&mut self, k: f64);
    fn clone_box(&self) -> Box<dyn Shape>;
}

#[derive(Clone)]
struct Square {
    side: f64,
}

#[derive(Clone)]
struct Circle {
    r: f64,
}

impl Shape for Square {
    fn describe(&self) -> String { format!("square {}", self.side) }
    fn scale(&mut self, k: f64) { self.side *= k; }
    fn clone_box(&self) -> Box<dyn Shape> { Box::new(self.clone()) }
}

impl Shape for Circle {
    fn describe(&self) -> String { format!("circle {}", self.r) }
    fn scale(&mut self, k: f64) { self.r *= k; }
    fn clone_box(&self) -> Box<dyn Shape> { Box::new(self.clone()) }
}

fn duplicate_all(shapes: &[Box<dyn Shape>]) -> Vec<Box<dyn Shape>> {
    shapes.iter().map(|s| s.clone_box()).collect()
}

fn scale_all(shapes: &mut [Box<dyn Shape>], k: f64) {
    for s in shapes.iter_mut() {
        s.scale(k);
    }
}
`,
});
