import type { RustGraderDef } from "../../grade/types";

const grader: RustGraderDef = {
  kind: "rust",
  mode: "harness",
  cases: [
    { label: "合計", expr: 'sum_csv("1, 2, 3")', expected: "Ok(6)" },
    {
      label: "負の数と 1 要素",
      expr: '(sum_csv("-5,10"), sum_csv(" 42 "))',
      expected: "(Ok(5), Ok(42))",
    },
    {
      label: "数値でない要素",
      expr: 'sum_csv("10,x,3")',
      expected: "Err(ParseIntError { kind: InvalidDigit })",
    },
    { label: "空文字列", expr: 'sum_csv("")', expected: "Err(ParseIntError { kind: Empty })" },
    { label: "平均", expr: 'average_csv("1,2,3,4")', expected: "Ok(2.5)" },
    {
      label: "平均もエラーを伝える",
      expr: 'average_csv("1,,3")',
      expected: "Err(ParseIntError { kind: Empty })",
    },
  ],
};

export default grader;
