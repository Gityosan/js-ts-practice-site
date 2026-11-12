import { defineProblem } from "../../../core/schemas";

export default defineProblem({
  id: "rust-types-fn-pointer",
  stage: "write",
  language: "rust",
  scenario: "rust",
  copy: {
    title: "関数ポインタ fn で計算表を作る",
    prompt: `## やること

関数ポインタ型 \`fn(i64, i64) -> i64\` を使って、演算子の記号から計算する関数を選ぼう。

- \`add\` / \`sub\` / \`mul\` は普通の関数（用意済み）
- \`lookup(op: char) -> Option<fn(i64, i64) -> i64>\` … \`'+'\`, \`'-'\`, \`'*'\` は対応する関数、\`'%'\` は **キャプチャしないクロージャ** \`|a, b| a % b\`、それ以外は \`None\`
- \`apply_twice(f: fn(i64) -> i64, x: i64) -> i64\` … \`f(f(x))\`
- \`calc(expr: &str) -> Option<i64>\` … \`"3 + 4"\` のように空白で区切られた「数 記号 数」を計算する。形式が違う・数でない・記号が不明なら \`None\`

\`\`\`rust
lookup('*').unwrap()(6, 7)       // 42
lookup('/')                      // None（Debug で比較するので .is_none() で確かめる）
apply_twice(|x| x * 3, 2)        // 18（キャプチャしないクロージャは fn 型に入る）
calc("10 % 4")                   // Some(2)
calc("1 ^ 2")                    // None
\`\`\``,
    hints: [
      "`match op { '+' => Some(add), '-' => Some(sub), '*' => Some(mul), '%' => Some(|a, b| a % b), _ => None }`",
      "`Some(add)` だけだと関数アイテム型になる場合がある。戻り値の型 `Option<fn(i64, i64) -> i64>` が決まっているので、ここでは自動で関数ポインタに変換される。",
      "`calc` は `let parts: Vec<&str> = expr.split_whitespace().collect();` で 3 つか確かめ、`parts[0].parse().ok()?` のように `?` で None を返す。記号は `parts[1].chars().next()?`。",
    ],
  },
  initialCode: `fn add(a: i64, b: i64) -> i64 { a + b }
fn sub(a: i64, b: i64) -> i64 { a - b }
fn mul(a: i64, b: i64) -> i64 { a * b }

fn lookup(op: char) -> Option<fn(i64, i64) -> i64> {
    todo!()
}

fn apply_twice(f: fn(i64) -> i64, x: i64) -> i64 {
    todo!()
}

fn calc(expr: &str) -> Option<i64> {
    todo!()
}
`,
  solutionCode: `fn add(a: i64, b: i64) -> i64 { a + b }
fn sub(a: i64, b: i64) -> i64 { a - b }
fn mul(a: i64, b: i64) -> i64 { a * b }

fn lookup(op: char) -> Option<fn(i64, i64) -> i64> {
    match op {
        '+' => Some(add),
        '-' => Some(sub),
        '*' => Some(mul),
        '%' => Some(|a, b| a % b),
        _ => None,
    }
}

fn apply_twice(f: fn(i64) -> i64, x: i64) -> i64 {
    f(f(x))
}

fn calc(expr: &str) -> Option<i64> {
    let parts: Vec<&str> = expr.split_whitespace().collect();
    if parts.len() != 3 {
        return None;
    }
    let a: i64 = parts[0].parse().ok()?;
    let b: i64 = parts[2].parse().ok()?;
    let mut chars = parts[1].chars();
    let op = chars.next()?;
    if chars.next().is_some() {
        return None;
    }
    let f = lookup(op)?;
    Some(f(a, b))
}
`,
});
