import type { RustGraderDef } from "../../grade/types";

const grader: RustGraderDef = {
  kind: "rust",
  mode: "harness",
  cases: [
    { label: "割り算", expr: "(divide(7, 2), divide(-9, 3))", expected: "(Ok(3), Ok(-3))" },
    { label: "0 で割る", expr: "divide(1, 0)", expected: 'Err("0 では割れません")' },
    {
      label: "平方根",
      expr: "(sqrt_checked(9.0), sqrt_checked(-4.0))",
      expected: '(Ok(3.0), Err("負の数の平方根: -4"))',
    },
    {
      label: "describe",
      expr: "(describe(divide(8, 2)), describe(divide(1, 0)))",
      expected: '("成功: 4", "失敗: 0 では割れません")',
    },
    { label: "must_get 範囲内", expr: "must_get(&[5, 6, 7], 2)", expected: "7" },
    {
      label: "must_get 範囲外は expect のメッセージで panic",
      expr: "{ let r = std::panic::catch_unwind(|| must_get(&[1], 3)); match r { Err(e) => e.downcast_ref::<String>().cloned().or(e.downcast_ref::<&str>().map(|s| s.to_string())), Ok(_) => None } }",
      expected: 'Some("添字が範囲外")',
    },
  ],
};

export default grader;
