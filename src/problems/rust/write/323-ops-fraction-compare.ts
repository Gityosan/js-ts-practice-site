import { defineProblem } from "../../../core/schemas";

export default defineProblem({
  id: "rust-ops-fraction-compare",
  stage: "write",
  language: "rust",
  scenario: "rust",
  copy: {
    title: "分数の比較を手で実装する",
    prompt: `## やること

分数 \`Fraction\` に、**値として** 比べる \`PartialEq\` と \`PartialOrd\` を手で実装しよう。derive だとフィールドを単純比較してしまい、\`1/2\` と \`2/4\` が等しくならない。

\`\`\`rust
#[derive(Debug, Clone, Copy)]
struct Fraction {
    num: i64,
    den: i64, // 常に正（new で保証）
}
\`\`\`

- \`Fraction::new(num, den)\` … 分母が負なら分子・分母の符号を反転して、分母を正にする（用意済み）
- \`PartialEq\` … \`a.num * b.den == b.num * a.den\` なら等しい
- \`PartialOrd\` … \`a.num * b.den\` と \`b.num * a.den\` を比べる
- \`Mul\` … \`a * b\` は分子同士・分母同士の積（約分しなくてよい）

\`\`\`rust
f(1, 2) == f(2, 4)   // true
f(1, 3) <  f(1, 2)   // true
f(-1, 2) < f(1, -3)  // true（-1/2 < -1/3。分母が負でも new が正に直している）
f(1, 2) * f(2, 3) == f(1, 3) // true
\`\`\`

\`f(n, d)\` は \`Fraction::new(n, d)\` の省略（用意済み）。`,
    hints: [
      "`use std::cmp::Ordering;` と `use std::ops::Mul;`",
      "`fn partial_cmp(&self, other: &Self) -> Option<Ordering> { (self.num * other.den).partial_cmp(&(other.num * self.den)) }`",
      "分母が正なので、交差して掛けても大小関係は変わらない。",
    ],
  },
  initialCode: `use std::cmp::Ordering;
use std::ops::Mul;

#[derive(Debug, Clone, Copy)]
struct Fraction {
    num: i64,
    den: i64,
}

impl Fraction {
    fn new(num: i64, den: i64) -> Fraction {
        assert!(den != 0, "denominator must not be zero");
        if den < 0 {
            Fraction { num: -num, den: -den }
        } else {
            Fraction { num, den }
        }
    }
}

fn f(num: i64, den: i64) -> Fraction {
    Fraction::new(num, den)
}

// ここに PartialEq / PartialOrd / Mul を実装する
`,
  solutionCode: `use std::cmp::Ordering;
use std::ops::Mul;

#[derive(Debug, Clone, Copy)]
struct Fraction {
    num: i64,
    den: i64,
}

impl Fraction {
    fn new(num: i64, den: i64) -> Fraction {
        assert!(den != 0, "denominator must not be zero");
        if den < 0 {
            Fraction { num: -num, den: -den }
        } else {
            Fraction { num, den }
        }
    }
}

fn f(num: i64, den: i64) -> Fraction {
    Fraction::new(num, den)
}

impl PartialEq for Fraction {
    fn eq(&self, other: &Self) -> bool {
        self.num * other.den == other.num * self.den
    }
}

impl PartialOrd for Fraction {
    fn partial_cmp(&self, other: &Self) -> Option<Ordering> {
        (self.num * other.den).partial_cmp(&(other.num * self.den))
    }
}

impl Mul for Fraction {
    type Output = Fraction;
    fn mul(self, o: Fraction) -> Fraction {
        Fraction::new(self.num * o.num, self.den * o.den)
    }
}
`,
});
