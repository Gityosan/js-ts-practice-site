import { defineProblem } from "../../../core/schemas";

export default defineProblem({
  id: "rust-ops-money-generic-sum",
  stage: "write",
  language: "rust",
  scenario: "rust",
  copy: {
    title: "Money の演算とジェネリックな合計",
    prompt: `## やること

金額を表す \`Money\`（単位は円、整数）に演算子を実装し、**どんな「足せる型」でも合計できる** ジェネリック関数を書こう。

\`\`\`rust
#[derive(Debug, Clone, Copy, PartialEq, PartialOrd, Default)]
struct Money(i64);
\`\`\`

- \`Add\` / \`Sub\` … \`Money(300) + Money(200)\` → \`Money(500)\`
- \`Neg\` … \`-Money(100)\` → \`Money(-100)\`
- \`Mul<i64>\` … \`Money(120) * 3\` → \`Money(360)\`
- \`sum_all<T>(items: &[T]) -> T\` … \`T::default()\` から始めて \`+\` で全部足す。\`Money\` にも \`i32\` にも \`f64\` にも使える
- \`cheapest(items: &[Money]) -> Option<Money>\` … 最小の金額。\`PartialOrd\` を使う（\`Money\` は \`Ord\` を持たないので \`min()\` は使えない）

\`\`\`rust
sum_all(&[Money(100), Money(250)]) // Money(350)
sum_all(&[1, 2, 3])                // 6
cheapest(&[Money(500), Money(80), Money(120)]) // Some(Money(80))
\`\`\``,
    hints: [
      "`fn sum_all<T: Add<Output = T> + Copy + Default>(items: &[T]) -> T`",
      "本体は `items.iter().fold(T::default(), |acc, &x| acc + x)`。",
      "`cheapest` は `items.iter().copied().fold(None, |best, x| match best { Some(b) if b <= x => Some(b), _ => Some(x) })` など。",
    ],
  },
  initialCode: `use std::ops::{Add, Mul, Neg, Sub};

#[derive(Debug, Clone, Copy, PartialEq, PartialOrd, Default)]
struct Money(i64);

// ここに Add / Sub / Neg / Mul<i64> for Money を実装する

// ここに sum_all を書く（型引数とトレイト境界も自分で書こう）

fn cheapest(items: &[Money]) -> Option<Money> {
    todo!()
}
`,
  solutionCode: `use std::ops::{Add, Mul, Neg, Sub};

#[derive(Debug, Clone, Copy, PartialEq, PartialOrd, Default)]
struct Money(i64);

impl Add for Money {
    type Output = Money;
    fn add(self, o: Money) -> Money { Money(self.0 + o.0) }
}

impl Sub for Money {
    type Output = Money;
    fn sub(self, o: Money) -> Money { Money(self.0 - o.0) }
}

impl Neg for Money {
    type Output = Money;
    fn neg(self) -> Money { Money(-self.0) }
}

impl Mul<i64> for Money {
    type Output = Money;
    fn mul(self, k: i64) -> Money { Money(self.0 * k) }
}

fn sum_all<T: Add<Output = T> + Copy + Default>(items: &[T]) -> T {
    items.iter().fold(T::default(), |acc, &x| acc + x)
}

fn cheapest(items: &[Money]) -> Option<Money> {
    items.iter().copied().fold(None, |best, x| match best {
        Some(b) if b <= x => Some(b),
        _ => Some(x),
    })
}
`,
});
