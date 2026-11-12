import { defineProblem } from "../../../core/schemas";

export default defineProblem({
  id: "rust-ops-vec2-add",
  stage: "write",
  language: "rust",
  scenario: "rust",
  copy: {
    title: "Vec2 に + - 単項マイナスを実装",
    prompt: `## やること

2 次元ベクトル \`Vec2\` に演算子を実装しよう。

\`\`\`rust
#[derive(Debug, Clone, Copy, PartialEq)]
struct Vec2 {
    x: i32,
    y: i32,
}
\`\`\`

- \`Add\` … \`a + b\` は成分ごとの和
- \`Sub\` … \`a - b\` は成分ごとの差
- \`Neg\` … \`-a\` は各成分の符号を反転

\`\`\`rust
v(1, 2) + v(3, 4) // Vec2 { x: 4, y: 6 }
v(1, 2) - v(3, 4) // Vec2 { x: -2, y: -2 }
-v(1, -2)         // Vec2 { x: -1, y: 2 }
\`\`\`

\`v(x, y)\` は \`Vec2 { x, y }\` を作る補助関数（用意済み）。`,
    hints: [
      "`use std::ops::{Add, Neg, Sub};`",
      "`impl Add for Vec2 { type Output = Vec2; fn add(self, o: Vec2) -> Vec2 { ... } }`",
      "`Neg` は `fn neg(self) -> Vec2` で引数は self だけ。",
    ],
  },
  initialCode: `use std::ops::{Add, Neg, Sub};

#[derive(Debug, Clone, Copy, PartialEq)]
struct Vec2 {
    x: i32,
    y: i32,
}

fn v(x: i32, y: i32) -> Vec2 {
    Vec2 { x, y }
}

// ここに impl Add / Sub / Neg for Vec2 を書く
`,
  solutionCode: `use std::ops::{Add, Neg, Sub};

#[derive(Debug, Clone, Copy, PartialEq)]
struct Vec2 {
    x: i32,
    y: i32,
}

fn v(x: i32, y: i32) -> Vec2 {
    Vec2 { x, y }
}

impl Add for Vec2 {
    type Output = Vec2;
    fn add(self, o: Vec2) -> Vec2 {
        Vec2 { x: self.x + o.x, y: self.y + o.y }
    }
}

impl Sub for Vec2 {
    type Output = Vec2;
    fn sub(self, o: Vec2) -> Vec2 {
        Vec2 { x: self.x - o.x, y: self.y - o.y }
    }
}

impl Neg for Vec2 {
    type Output = Vec2;
    fn neg(self) -> Vec2 {
        Vec2 { x: -self.x, y: -self.y }
    }
}
`,
});
