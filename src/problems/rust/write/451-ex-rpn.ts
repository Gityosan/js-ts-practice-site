import { defineProblem } from "../../../core/schemas";

export default defineProblem({
  id: "rust-ex-rpn-calculator",
  stage: "write",
  language: "rust",
  scenario: "rust",
  copy: {
    title: "総合: スタックで逆ポーランド記法の計算機",
    prompt: `## やること

**逆ポーランド記法（RPN）** の式を計算する \`eval_rpn(expr: &str) -> Result<i64, String>\` を書こう。RPN では演算子を数の **後ろ** に書く。

| 普通の書き方 | RPN |
|---|---|
| \`1 + 2\` | \`1 2 +\` |
| \`(3 + 4) * 2\` | \`3 4 + 2 *\` |
| \`10 - 2 * 3\` | \`10 2 3 * -\` |

## アルゴリズム（スタック）

- トークンは空白区切り（\`split_whitespace\`）
- 数なら スタックに \`push\`
- 演算子 \`+ - * /\` なら、スタックから 2 つ \`pop\`（先に出たほうが **右側**）し、計算結果を \`push\`
- 最後にスタックにちょうど 1 つ残っていれば、それが答え

## エラー（この文字列で \`Err\` を返す）

| 状況 | エラー |
|---|---|
| 演算子のときに数が 2 つない | \`"数が足りません"\` |
| 0 で割った | \`"0 で割れません"\` |
| 数でも演算子でもないトークン | \`"不明なトークン: xxx"\`（xxx はそのトークン） |
| 最後にスタックが 1 つでない（空の式も） | \`"式が不正です"\` |

\`/\` は整数の割り算（切り捨て）でよい。`,
    hints: [
      '`let mut stack: Vec<i64> = Vec::new();` と `match tok { "+" | "-" | "*" | "/" => ..., _ => ... }`',
      '`let b = stack.pop().ok_or("数が足りません")?; let a = stack.pop().ok_or("数が足りません")?;`（`&str` から `String` へは `.to_string()` か `map_err` で）',
      '数の変換: `tok.parse::<i64>().map_err(|_| format!("不明なトークン: {tok}"))?`。最後は `if stack.len() == 1 { Ok(stack[0]) } else { Err(...) }`',
    ],
  },
  initialCode: `fn eval_rpn(expr: &str) -> Result<i64, String> {
    let mut stack: Vec<i64> = Vec::new();
    todo!()
}
`,
  solutionCode: `fn eval_rpn(expr: &str) -> Result<i64, String> {
    let mut stack: Vec<i64> = Vec::new();
    for tok in expr.split_whitespace() {
        match tok {
            "+" | "-" | "*" | "/" => {
                let b = stack.pop().ok_or("数が足りません".to_string())?;
                let a = stack.pop().ok_or("数が足りません".to_string())?;
                let v = match tok {
                    "+" => a + b,
                    "-" => a - b,
                    "*" => a * b,
                    _ => {
                        if b == 0 {
                            return Err("0 で割れません".to_string());
                        }
                        a / b
                    }
                };
                stack.push(v);
            }
            _ => {
                let n = tok
                    .parse::<i64>()
                    .map_err(|_| format!("不明なトークン: {tok}"))?;
                stack.push(n);
            }
        }
    }
    if stack.len() == 1 {
        Ok(stack[0])
    } else {
        Err("式が不正です".to_string())
    }
}
`,
});
