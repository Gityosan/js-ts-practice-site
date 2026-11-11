import { defineProblem } from "../../../core/schemas";

export default defineProblem({
  id: "rust-test-result-style",
  stage: "write",
  language: "rust",
  scenario: "rust",
  copy: {
    title: "Result を返すテストを書く",
    prompt: `## やること

\`#[test] fn ...() -> Result<(), String>\` 形式のテストでは、\`?\` で途中のエラーをそのまま「テスト失敗」にできる。この書き方を練習しよう。

### 1. テストされる関数

- \`parse_point(s: &str) -> Result<(i32, i32), String>\` … \`"3,-4"\` のような「整数,整数」を読む。カンマがなければ \`Err("missing comma")\`、整数でなければ \`Err("bad number: x")\`（\`x\` は読めなかった部分。前後の空白は取り除いてから読む）

### 2. Result を返すテスト関数

- \`check_point(input: &str, expected: (i32, i32)) -> Result<(), String>\` … \`parse_point(input)?\` で読み、\`expected\` と同じなら \`Ok(())\`、違えば \`Err("expected (1, 2), got (3, 4)")\` の形のメッセージを返す
- \`run_all(cases: &[(&str, (i32, i32))]) -> Result<usize, String>\` … 全ケースに \`check_point\` を \`?\` 付きで適用し、全部通れば通ったケース数を返す。最初の失敗のメッセージで止まる

\`\`\`rust
parse_point(" 3 , -4 ")             // Ok((3, -4))
check_point("1,2", (1, 2))          // Ok(())
check_point("1,2", (2, 1))          // Err("expected (2, 1), got (1, 2)")
check_point("1;2", (1, 2))          // Err("missing comma")   ← ? で parse のエラーがそのまま返る
run_all(&[("0,0", (0, 0)), ("5,6", (5, 6))]) // Ok(2)
\`\`\``,
    hints: [
      "`let (a, b) = s.split_once(',').ok_or(\"missing comma\".to_string())?;`",
      '数の変換は小さな補助関数 `fn num(t: &str) -> Result<i32, String> { t.trim().parse().map_err(|_| format!("bad number: {}", t.trim())) }` を作ると楽。',
      '`check_point` は `let got = parse_point(input)?; if got == expected { Ok(()) } else { Err(format!("expected {:?}, got {:?}", expected, got)) }`。',
    ],
  },
  initialCode: `fn parse_point(s: &str) -> Result<(i32, i32), String> {
    todo!()
}

fn check_point(input: &str, expected: (i32, i32)) -> Result<(), String> {
    todo!()
}

fn run_all(cases: &[(&str, (i32, i32))]) -> Result<usize, String> {
    todo!()
}
`,
  solutionCode: `fn num(t: &str) -> Result<i32, String> {
    let t = t.trim();
    t.parse().map_err(|_| format!("bad number: {}", t))
}

fn parse_point(s: &str) -> Result<(i32, i32), String> {
    let (a, b) = s.split_once(',').ok_or("missing comma".to_string())?;
    Ok((num(a)?, num(b)?))
}

fn check_point(input: &str, expected: (i32, i32)) -> Result<(), String> {
    let got = parse_point(input)?;
    if got == expected {
        Ok(())
    } else {
        Err(format!("expected {:?}, got {:?}", expected, got))
    }
}

fn run_all(cases: &[(&str, (i32, i32))]) -> Result<usize, String> {
    for (input, expected) in cases {
        check_point(input, *expected)?;
    }
    Ok(cases.len())
}
`,
});
