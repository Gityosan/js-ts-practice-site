import { defineProblem } from "../../../core/schemas";

export default defineProblem({
  id: "rust-match-result-sum",
  stage: "write",
  language: "rust",
  scenario: "rust",
  copy: {
    title: "Result を match して数え分ける",
    prompt: `## やること

文字列のスライスを 1 つずつ \`parse::<i32>()\` して、**成功したものの合計** と **失敗した個数** を返す
\`sum_and_errors(items: &[&str]) -> (i32, usize)\` を書こう。

\`\`\`rust
sum_and_errors(&["1", "2", "x", "40"]);   // (43, 1)
sum_and_errors(&[]);                      // (0, 0)
\`\`\`

\`parse\` は \`Result<i32, ParseIntError>\` を返すので、match で \`Ok(n)\` と \`Err(_)\` に分ける。

さらに、Option を match する関数 \`label(n: Option<i32>) -> &'static str\` も書こう。

- \`None\` → \`"なし"\`
- \`Some(0)\` → \`"ゼロ"\`
- 正の数 → \`"正"\`、負の数 → \`"負"\`

\`Some(0)\` のように **パターンの中に具体的な値** を書ける。\`Some(n) if n > 0\` のような条件（マッチガード）も使える。`,
    hints: [
      "`match s.parse::<i32>() { Ok(n) => sum += n, Err(_) => errors += 1 }`",
      "前後の空白は parse 失敗になる（仕様どおり）",
      'label: `Some(0) => "ゼロ", Some(n) if n > 0 => "正", Some(_) => "負", None => "なし"`',
    ],
  },
  initialCode: `fn sum_and_errors(items: &[&str]) -> (i32, usize) {
    todo!()
}

fn label(n: Option<i32>) -> &'static str {
    todo!()
}
`,
  solutionCode: `fn sum_and_errors(items: &[&str]) -> (i32, usize) {
    let mut sum = 0;
    let mut errors = 0;
    for s in items {
        match s.parse::<i32>() {
            Ok(n) => sum += n,
            Err(_) => errors += 1,
        }
    }
    (sum, errors)
}

fn label(n: Option<i32>) -> &'static str {
    match n {
        None => "なし",
        Some(0) => "ゼロ",
        Some(n) if n > 0 => "正",
        Some(_) => "負",
    }
}
`,
});
