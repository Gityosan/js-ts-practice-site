import { defineProblem } from "../../../core/schemas";

export default defineProblem({
  id: "rust-ops-vec2-scale-assign",
  stage: "write",
  language: "rust",
  scenario: "rust",
  copy: {
    title: "スカラー倍と += / -=",
    prompt: `## やること

\`Vec2\` に、**右辺が違う型** の演算と **複合代入** を実装しよう。

- \`Mul<i32> for Vec2\` … \`v * 3\`（各成分を 3 倍）
- \`Mul<Vec2> for i32\` … \`3 * v\`（左辺が \`i32\`。結果は同じ）
- \`Mul<Vec2> for Vec2\` … \`a * b\` は **内積**（\`a.x * b.x + a.y * b.y\`）で、結果は \`i32\`
- \`AddAssign\` … \`a += b\`
- \`SubAssign\` … \`a -= b\`

\`\`\`rust
v(1, 2) * 3      // Vec2 { x: 3, y: 6 }
3 * v(1, 2)      // Vec2 { x: 3, y: 6 }
v(1, 2) * v(3, 4) // 11（i32）
let mut a = v(1, 1);
a += v(2, 3);    // a は Vec2 { x: 3, y: 4 }
\`\`\``,
    hints: [
      "`impl Mul<i32> for Vec2 { type Output = Vec2; fn mul(self, k: i32) -> Vec2 { ... } }`",
      "`impl Mul<Vec2> for i32` の中では `v * self` と既に作った実装を使える。内積は `type Output = i32;`。",
      "`impl AddAssign for Vec2 { fn add_assign(&mut self, o: Vec2) { self.x += o.x; ... } }`（戻り値なし）",
    ],
  },
  initialCode: `use std::ops::{AddAssign, Mul, SubAssign};

#[derive(Debug, Clone, Copy, PartialEq)]
struct Vec2 {
    x: i32,
    y: i32,
}

fn v(x: i32, y: i32) -> Vec2 {
    Vec2 { x, y }
}

// ここに Mul<i32> for Vec2 / Mul<Vec2> for i32 / Mul<Vec2> for Vec2 / AddAssign / SubAssign を書く
`,
  solutionCode: `use std::ops::{AddAssign, Mul, SubAssign};

#[derive(Debug, Clone, Copy, PartialEq)]
struct Vec2 {
    x: i32,
    y: i32,
}

fn v(x: i32, y: i32) -> Vec2 {
    Vec2 { x, y }
}

impl Mul<i32> for Vec2 {
    type Output = Vec2;
    fn mul(self, k: i32) -> Vec2 {
        Vec2 { x: self.x * k, y: self.y * k }
    }
}

impl Mul<Vec2> for i32 {
    type Output = Vec2;
    fn mul(self, v: Vec2) -> Vec2 {
        v * self
    }
}

impl Mul<Vec2> for Vec2 {
    type Output = i32;
    fn mul(self, o: Vec2) -> i32 {
        self.x * o.x + self.y * o.y
    }
}

impl AddAssign for Vec2 {
    fn add_assign(&mut self, o: Vec2) {
        self.x += o.x;
        self.y += o.y;
    }
}

impl SubAssign for Vec2 {
    fn sub_assign(&mut self, o: Vec2) {
        self.x -= o.x;
        self.y -= o.y;
    }
}
`,
});
