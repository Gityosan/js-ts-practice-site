import { defineProblem } from "../../../core/schemas";

export default defineProblem({
  id: "rust-trait-default-generic-units",
  stage: "write",
  language: "rust",
  scenario: "rust",
  copy: {
    title: "デフォルト型引数: 単位の違う足し算",
    prompt: `## やること

長さの単位 \`Mm\`（ミリ）と \`M\`（メートル）を **ニュータイプ** で区別し、\`Add\` のデフォルト型引数 \`Rhs = Self\` を使い分けよう。

\`\`\`rust
#[derive(Debug, Clone, Copy, PartialEq)]
struct Mm(u32);
#[derive(Debug, Clone, Copy, PartialEq)]
struct M(u32);
\`\`\`

- \`impl Add for Mm\` … \`Mm + Mm\` → \`Mm\`（\`Rhs\` は省略 = Self）
- \`impl Add<M> for Mm\` … \`Mm + M\` → \`Mm\`（1 m = 1000 mm）
- \`impl Add<Mm> for M\` … \`M + Mm\` → **\`Mm\`**（単位の細かい方に揃える）
- \`total_mm(parts: &[Mm]) -> Mm\` … 全部足す

\`\`\`rust
Mm(300) + Mm(200) // Mm(500)
Mm(500) + M(2)    // Mm(2500)
M(1) + Mm(5)      // Mm(1005)
\`\`\``,
    hints: [
      "`impl Add<M> for Mm { type Output = Mm; fn add(self, o: M) -> Mm { Mm(self.0 + o.0 * 1000) } }`",
      "`impl Add<Mm> for M` の `Output` は `Mm`。",
      "`total_mm` は `parts.iter().fold(Mm(0), |acc, &p| acc + p)`。",
    ],
  },
  initialCode: `use std::ops::Add;

#[derive(Debug, Clone, Copy, PartialEq)]
struct Mm(u32);

#[derive(Debug, Clone, Copy, PartialEq)]
struct M(u32);

// ここに 3 つの impl Add を書く

fn total_mm(parts: &[Mm]) -> Mm {
    todo!()
}
`,
  solutionCode: `use std::ops::Add;

#[derive(Debug, Clone, Copy, PartialEq)]
struct Mm(u32);

#[derive(Debug, Clone, Copy, PartialEq)]
struct M(u32);

impl Add for Mm {
    type Output = Mm;
    fn add(self, o: Mm) -> Mm {
        Mm(self.0 + o.0)
    }
}

impl Add<M> for Mm {
    type Output = Mm;
    fn add(self, o: M) -> Mm {
        Mm(self.0 + o.0 * 1000)
    }
}

impl Add<Mm> for M {
    type Output = Mm;
    fn add(self, o: Mm) -> Mm {
        Mm(self.0 * 1000 + o.0)
    }
}

fn total_mm(parts: &[Mm]) -> Mm {
    parts.iter().fold(Mm(0), |acc, &p| acc + p)
}
`,
});
