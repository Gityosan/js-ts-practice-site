import type { RustGraderDef } from "../../grade/types";

const grader: RustGraderDef = {
  kind: "rust",
  mode: "harness",
  cases: [
    {
      label: "関数を選んで呼ぶ",
      expr: "(lookup('*').unwrap()(6, 7), lookup('-').unwrap()(1, 5))",
      expected: "(42, -4)",
    },
    { label: "クロージャも入る", expr: "lookup('%').unwrap()(10, 4)", expected: "2" },
    { label: "知らない記号", expr: "lookup('/').is_none()", expected: "true" },
    {
      label: "apply_twice",
      expr: "(apply_twice(|x| x * 3, 2), apply_twice(i64::abs, -5))",
      expected: "(18, 5)",
    },
    {
      label: "式を計算",
      expr: '(calc("3 + 4"), calc("10 % 4"), calc("-2 * 8"))',
      expected: "(Some(7), Some(2), Some(-16))",
    },
    {
      label: "不正な式",
      expr: '(calc("1 ^ 2"), calc("1 +"), calc("a + 1"), calc("1 ++ 2"))',
      expected: "(None, None, None, None)",
    },
  ],
};

export default grader;
