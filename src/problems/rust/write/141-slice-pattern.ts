import { defineProblem } from "../../../core/schemas";

export default defineProblem({
  id: "rust-slice-pattern-ends",
  stage: "write",
  language: "rust",
  scenario: "rust",
  copy: {
    title: "スライスパターンで先頭と末尾",
    prompt: `## やること

スライスパターンを使って 3 つの関数を書こう（\`v[0]\` のような添字アクセスは使わずに）。

- \`ends(v: &[i32]) -> Option<(i32, i32)>\` … 先頭と末尾の組。要素が 1 つなら \`(x, x)\`、空なら \`None\`
- \`describe(v: &[i32]) -> String\` … 空 → \`"空"\`、1 つ → \`"1個: x"\`、2 つ → \`"2個: a,b"\`、3 つ以上 → \`"先頭a 末尾b 他n個"\`（n は間の個数）
- \`sum_rec(v: &[i32]) -> i32\` … 合計を **再帰** で。\`[head, rest @ ..]\` で先頭と残りに分ける

\`\`\`rust
ends(&[3, 9, 4]);            // Some((3, 4))
describe(&[1, 2, 3, 4, 5]);  // "先頭1 末尾5 他3個"
sum_rec(&[1, 2, 3]);         // 6
\`\`\`

- \`[first, .., last]\` の \`..\` は「0 個以上の残り」
- \`[first, middle @ .., last]\` とすると間の部分をスライスで受け取れる（\`middle.len()\` で個数）
- \`match v { ... }\` で \`&[i32]\` に対してマッチすると、取り出した要素は \`&i32\` になる。\`*first\` で値にするか、\`&[first, .., last]\` パターンで値として取り出そう`,
    hints: [
      "`match v { [] => None, [x] => Some((*x, *x)), [first, .., last] => Some((*first, *last)) }`",
      'describe: `[first, middle @ .., last] => format!("先頭{first} 末尾{last} 他{}個", middle.len())`',
      "sum_rec: `[] => 0, [head, rest @ ..] => head + sum_rec(rest)`",
    ],
  },
  initialCode: `fn ends(v: &[i32]) -> Option<(i32, i32)> {
    todo!()
}

fn describe(v: &[i32]) -> String {
    todo!()
}

fn sum_rec(v: &[i32]) -> i32 {
    todo!()
}
`,
  solutionCode: `fn ends(v: &[i32]) -> Option<(i32, i32)> {
    match v {
        [] => None,
        [x] => Some((*x, *x)),
        [first, .., last] => Some((*first, *last)),
    }
}

fn describe(v: &[i32]) -> String {
    match v {
        [] => String::from("空"),
        [x] => format!("1個: {x}"),
        [a, b] => format!("2個: {a},{b}"),
        [first, middle @ .., last] => format!("先頭{first} 末尾{last} 他{}個", middle.len()),
    }
}

fn sum_rec(v: &[i32]) -> i32 {
    match v {
        [] => 0,
        [head, rest @ ..] => head + sum_rec(rest),
    }
}
`,
});
