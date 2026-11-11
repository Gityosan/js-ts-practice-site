import { defineProblem } from "../../../core/schemas";

export default defineProblem({
  id: "rust-display-impl",
  stage: "write",
  language: "rust",
  scenario: "rust",
  copy: {
    title: "Display を実装して to_string する",
    prompt: `## やること

2 つの型に \`std::fmt::Display\` を手で実装しよう。

### Point

\`Point { x: 1, y: -2 }\` → \`"(1, -2)"\`

### Fraction（分数）

\`Fraction { num, den }\` を \`"分子/分母"\` で表示する。ただし **分母が 1 のときは分子だけ**。

\`\`\`rust
Fraction { num: 3, den: 4 }.to_string()  // "3/4"
Fraction { num: 5, den: 1 }.to_string()  // "5"
\`\`\`

Display を実装すると \`.to_string()\` と \`format!("{}", x)\` が使えるようになる。

\`\`\`rust
impl fmt::Display for Point {
    fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
        write!(f, "...", ...)
    }
}
\`\`\``,
    hints: [
      '`write!(f, "({}, {})", self.x, self.y)`',
      'Fraction は `if self.den == 1 { write!(f, "{}", self.num) } else { write!(f, "{}/{}", self.num, self.den) }`',
      "write! は fmt::Result を返すので、そのまま最後の式にすればよい",
    ],
  },
  initialCode: `use std::fmt;

struct Point {
    x: i32,
    y: i32,
}

struct Fraction {
    num: i64,
    den: i64,
}

impl fmt::Display for Point {
    fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
        todo!()
    }
}

impl fmt::Display for Fraction {
    fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
        todo!()
    }
}
`,
  solutionCode: `use std::fmt;

struct Point {
    x: i32,
    y: i32,
}

struct Fraction {
    num: i64,
    den: i64,
}

impl fmt::Display for Point {
    fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
        write!(f, "({}, {})", self.x, self.y)
    }
}

impl fmt::Display for Fraction {
    fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
        if self.den == 1 {
            write!(f, "{}", self.num)
        } else {
            write!(f, "{}/{}", self.num, self.den)
        }
    }
}
`,
});
