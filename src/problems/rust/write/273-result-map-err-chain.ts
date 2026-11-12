import { defineProblem } from "../../../core/schemas";

export default defineProblem({
  id: "rust-result-map-err-chain",
  stage: "write",
  language: "rust",
  scenario: "rust",
  copy: {
    title: "Result の map / map_err / and_then / unwrap_or_else",
    prompt: `## やること

\`"a/b"\` の形の文字列を受け取り、割り算をする処理を **Result のコンビネータ** で組み立てよう。エラーの型はすべて \`String\`。

- （1）\`parse_num(s: &str) -> Result<i32, String>\` … trim して i32 に。失敗したら \`Err("not a number: {s}")\`（\`map_err\`）
- （2）\`divide(a: i32, b: i32) -> Result<i32, String>\` … b が 0 なら \`Err("division by zero")\`、それ以外は \`Ok(a / b)\`
- （3）\`calc(expr: &str) -> Result<i32, String>\`
- \`/\` がなければ \`Err("missing /")\`
- 両辺を parse_num して divide する（\`and_then\` や \`?\` で）
- （4）\`calc_or_zero(expr: &str) -> (i32, String)\` … calc の結果を、成功なら \`(値, "ok")\`、失敗なら \`(0, エラーメッセージ)\` にする（\`map\` と \`unwrap_or_else\`）

\`\`\`rust
calc("10 / 3")       // Ok(3)
calc("10/0")         // Err("division by zero")
calc("x/2")          // Err("not a number: x")
calc_or_zero("8/2")  // (4, "ok")
\`\`\``,
    hints: [
      '`s.trim().parse::<i32>().map_err(|_| format!("not a number: {}", s.trim()))`',
      "calc: `let (a, b) = expr.split_once('/').ok_or(\"missing /\")?; let a = parse_num(a)?; parse_num(b).and_then(|b| divide(a, b))`",
      'calc_or_zero: `calc(expr).map(|v| (v, "ok".to_string())).unwrap_or_else(|e| (0, e))`',
    ],
  },
  initialCode: `fn parse_num(s: &str) -> Result<i32, String> {
    todo!()
}

fn divide(a: i32, b: i32) -> Result<i32, String> {
    todo!()
}

fn calc(expr: &str) -> Result<i32, String> {
    todo!()
}

fn calc_or_zero(expr: &str) -> (i32, String) {
    todo!()
}
`,
  solutionCode: `fn parse_num(s: &str) -> Result<i32, String> {
    let t = s.trim();
    t.parse::<i32>().map_err(|_| format!("not a number: {}", t))
}

fn divide(a: i32, b: i32) -> Result<i32, String> {
    if b == 0 {
        Err(String::from("division by zero"))
    } else {
        Ok(a / b)
    }
}

fn calc(expr: &str) -> Result<i32, String> {
    let (a, b) = expr.split_once('/').ok_or("missing /")?;
    let a = parse_num(a)?;
    parse_num(b).and_then(|b| divide(a, b))
}

fn calc_or_zero(expr: &str) -> (i32, String) {
    calc(expr)
        .map(|v| (v, String::from("ok")))
        .unwrap_or_else(|e| (0, e))
}
`,
});
