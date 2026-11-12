import { defineProblem } from "../../../core/schemas";

export default defineProblem({
  id: "rust-enum-traffic-light",
  stage: "write",
  language: "rust",
  scenario: "rust",
  copy: {
    title: "信号機 enum の次の状態",
    prompt: `## やること

信号機の状態を表す enum \`Light\` にメソッドを実装しよう。

- \`next(self) -> Light\` … 次の状態。**赤 → 青 → 黄 → 赤 → …**
- \`duration(&self) -> u32\` … 表示秒数。赤 30、青 25、黄 3
- \`can_go(&self) -> bool\` … 進んでよいのは青のときだけ

さらに関数 \`run(start: Light, steps: usize) -> Vec<Light>\` を書こう。\`start\` から \`steps\` 回 \`next\` した状態を順に並べた Vec（\`start\` も含めて長さ \`steps + 1\`）を返す。

\`\`\`rust
run(Light::Red, 3);  // [Red, Green, Yellow, Red]
\`\`\`

\`#[derive(Clone, Copy)]\` が付いているので、\`Light\` は整数のように気軽にコピーできる（\`next(self)\` で消費しても元の変数をまた使える）。`,
    hints: [
      "`match self { Light::Red => Light::Green, ... }`",
      "`can_go` は `matches!(self, Light::Green)` や `*self == Light::Green` でも書ける",
      "run: `let mut cur = start; let mut v = vec![cur]; for _ in 0..steps { cur = cur.next(); v.push(cur); }`",
    ],
  },
  initialCode: `#[derive(Debug, Clone, Copy, PartialEq)]
enum Light {
    Red,
    Yellow,
    Green,
}

impl Light {
    fn next(self) -> Light {
        todo!()
    }

    fn duration(&self) -> u32 {
        todo!()
    }

    fn can_go(&self) -> bool {
        todo!()
    }
}

fn run(start: Light, steps: usize) -> Vec<Light> {
    todo!()
}
`,
  solutionCode: `#[derive(Debug, Clone, Copy, PartialEq)]
enum Light {
    Red,
    Yellow,
    Green,
}

impl Light {
    fn next(self) -> Light {
        match self {
            Light::Red => Light::Green,
            Light::Green => Light::Yellow,
            Light::Yellow => Light::Red,
        }
    }

    fn duration(&self) -> u32 {
        match self {
            Light::Red => 30,
            Light::Green => 25,
            Light::Yellow => 3,
        }
    }

    fn can_go(&self) -> bool {
        *self == Light::Green
    }
}

fn run(start: Light, steps: usize) -> Vec<Light> {
    let mut cur = start;
    let mut v = vec![cur];
    for _ in 0..steps {
        cur = cur.next();
        v.push(cur);
    }
    v
}
`,
});
