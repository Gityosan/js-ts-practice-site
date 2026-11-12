import { defineProblem } from "../../../core/schemas";

export default defineProblem({
  id: "rust-result-divide",
  stage: "write",
  language: "rust",
  scenario: "rust",
  copy: {
    title: "Result を返す関数と match",
    prompt: `## やること

失敗しうる計算を \`Result\` で返そう。

- \`divide(a: i32, b: i32) -> Result<i32, String>\` … \`b\` が 0 なら \`Err("0 では割れません")\`、それ以外 \`Ok(a / b)\`
- \`sqrt_checked(x: f64) -> Result<f64, String>\` … 負なら \`Err("負の数の平方根: -4")\` のように値を含めたメッセージ、それ以外 \`Ok(x.sqrt())\`
- \`describe(r: Result<i32, String>) -> String\` … match で \`Ok(v)\` → \`"成功: v"\`、\`Err(e)\` → \`"失敗: e"\`
- \`must_get(v: &[i32], i: usize) -> i32\` … i 番目を返す。範囲外は **プログラムのバグ** とみなし、\`v.get(i).expect("添字が範囲外")\` で panic させる

\`\`\`rust
divide(7, 2);                 // Ok(3)
divide(1, 0);                 // Err("0 では割れません")
describe(divide(1, 0));       // "失敗: 0 では割れません"
\`\`\``,
    hints: [
      '`if b == 0 { return Err(String::from("0 では割れません")); } Ok(a / b)`',
      '`Err(format!("負の数の平方根: {x}"))`',
      'describe: `match r { Ok(v) => format!("成功: {v}"), Err(e) => format!("失敗: {e}") }`',
      'must_get: `*v.get(i).expect("添字が範囲外")`',
    ],
  },
  initialCode: `fn divide(a: i32, b: i32) -> Result<i32, String> {
    todo!()
}

fn sqrt_checked(x: f64) -> Result<f64, String> {
    todo!()
}

fn describe(r: Result<i32, String>) -> String {
    todo!()
}

fn must_get(v: &[i32], i: usize) -> i32 {
    todo!()
}
`,
  solutionCode: `fn divide(a: i32, b: i32) -> Result<i32, String> {
    if b == 0 {
        return Err(String::from("0 では割れません"));
    }
    Ok(a / b)
}

fn sqrt_checked(x: f64) -> Result<f64, String> {
    if x < 0.0 {
        Err(format!("負の数の平方根: {x}"))
    } else {
        Ok(x.sqrt())
    }
}

fn describe(r: Result<i32, String>) -> String {
    match r {
        Ok(v) => format!("成功: {v}"),
        Err(e) => format!("失敗: {e}"),
    }
}

fn must_get(v: &[i32], i: usize) -> i32 {
    *v.get(i).expect("添字が範囲外")
}
`,
});
