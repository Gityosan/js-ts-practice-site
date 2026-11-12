import { defineProblem } from "../../../core/schemas";

export default defineProblem({
  id: "rust-fmt-display-impl",
  stage: "write",
  language: "rust",
  scenario: "rust",
  copy: {
    title: "Display を実装して {} で表示する",
    prompt: `## やること

分数を表す構造体 \`Fraction\` に \`std::fmt::Display\` を実装しよう。

- 普通は \`分子/分母\` と表示する。例: \`Fraction { num: 3, den: 4 }\` → \`3/4\`
- 分母が 1 なら分子だけ表示する。例: \`Fraction { num: 5, den: 1 }\` → \`5\`

\`\`\`rust
use std::fmt;

impl fmt::Display for Fraction {
    fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
        write!(f, "...", ...)
    }
}
\`\`\`

Display を実装すると \`to_string()\` も自動で使えるようになる。採点では \`format!("{}", 値)\` と \`値.to_string()\` の両方で確かめる。`,
    hints: [
      '`if self.den == 1 { write!(f, "{}", self.num) } else { ... }`',
      '`write!(f, "{}/{}", self.num, self.den)`',
      "if / else の両方の枝が `fmt::Result` を返すように、`;` を付けない",
    ],
  },
  initialCode: `use std::fmt;

struct Fraction {
    num: i32,
    den: i32,
}

impl fmt::Display for Fraction {
    fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
        todo!()
    }
}
`,
  solutionCode: `use std::fmt;

struct Fraction {
    num: i32,
    den: i32,
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
