import { defineProblem } from "../../../core/schemas";

export default defineProblem({
  id: "rust-box-expr-tree",
  stage: "write",
  language: "rust",
  scenario: "rust",
  copy: {
    title: "式の木を評価する",
    prompt: `## やること

数式を木構造で表す enum \`Expr\` がある。式を計算する \`eval\` と、式を文字列にする \`show\` を書こう。

\`\`\`rust
enum Expr {
    Num(i64),
    Add(Box<Expr>, Box<Expr>),
    Mul(Box<Expr>, Box<Expr>),
    Neg(Box<Expr>),
}
\`\`\`

- \`eval(e: &Expr) -> i64\`
- \`show(e: &Expr) -> String\` … \`Num\` は数字そのまま、\`Add\` は \`(a + b)\`、\`Mul\` は \`(a * b)\`、\`Neg\` は \`-a\`

\`\`\`rust
// (1 + 2) * 3
let e = mul(add(num(1), num(2)), num(3));
eval(&e) // 9
show(&e) // "((1 + 2) * 3)"
show(&neg(num(4))) // "-4"
\`\`\`

\`num\` / \`add\` / \`mul\` / \`neg\` は Box で包む手間を省く補助関数で、初期コードに用意してある。`,
    hints: [
      "`match e { Expr::Num(n) => *n, Expr::Add(a, b) => eval(a) + eval(b), ... }`",
      "`a` は `&Box<Expr>` だが、`eval(a)` とそのまま渡せる（参照外し型強制）。",
      '`show` は `format!("({} + {})", show(a), show(b))` のように再帰する。',
    ],
  },
  initialCode: `enum Expr {
    Num(i64),
    Add(Box<Expr>, Box<Expr>),
    Mul(Box<Expr>, Box<Expr>),
    Neg(Box<Expr>),
}

fn num(n: i64) -> Expr { Expr::Num(n) }
fn add(a: Expr, b: Expr) -> Expr { Expr::Add(Box::new(a), Box::new(b)) }
fn mul(a: Expr, b: Expr) -> Expr { Expr::Mul(Box::new(a), Box::new(b)) }
fn neg(a: Expr) -> Expr { Expr::Neg(Box::new(a)) }

fn eval(e: &Expr) -> i64 {
    todo!()
}

fn show(e: &Expr) -> String {
    todo!()
}
`,
  solutionCode: `enum Expr {
    Num(i64),
    Add(Box<Expr>, Box<Expr>),
    Mul(Box<Expr>, Box<Expr>),
    Neg(Box<Expr>),
}

fn num(n: i64) -> Expr { Expr::Num(n) }
fn add(a: Expr, b: Expr) -> Expr { Expr::Add(Box::new(a), Box::new(b)) }
fn mul(a: Expr, b: Expr) -> Expr { Expr::Mul(Box::new(a), Box::new(b)) }
fn neg(a: Expr) -> Expr { Expr::Neg(Box::new(a)) }

fn eval(e: &Expr) -> i64 {
    match e {
        Expr::Num(n) => *n,
        Expr::Add(a, b) => eval(a) + eval(b),
        Expr::Mul(a, b) => eval(a) * eval(b),
        Expr::Neg(a) => -eval(a),
    }
}

fn show(e: &Expr) -> String {
    match e {
        Expr::Num(n) => n.to_string(),
        Expr::Add(a, b) => format!("({} + {})", show(a), show(b)),
        Expr::Mul(a, b) => format!("({} * {})", show(a), show(b)),
        Expr::Neg(a) => format!("-{}", show(a)),
    }
}
`,
});
