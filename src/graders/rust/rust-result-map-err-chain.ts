import type { RustGraderDef } from "../../grade/types";

const grader: RustGraderDef = {
  kind: "rust",
  mode: "harness",
  cases: [
    {
      label: "parse_num",
      expr: '(parse_num(" 42 "), parse_num("4x"))',
      expected: '(Ok(42), Err("not a number: 4x"))',
    },
    {
      label: "divide",
      expr: "(divide(7, 2), divide(1, 0))",
      expected: '(Ok(3), Err("division by zero"))',
    },
    { label: "calc 成功", expr: '(calc("10 / 3"), calc("-9/3"))', expected: "(Ok(3), Ok(-3))" },
    {
      label: "calc エラー",
      expr: '(calc("10/0"), calc("x/2"), calc("10"))',
      expected: '(Err("division by zero"), Err("not a number: x"), Err("missing /"))',
    },
    {
      label: "calc_or_zero",
      expr: '(calc_or_zero("8/2"), calc_or_zero("8/0"))',
      expected: '((4, "ok"), (0, "division by zero"))',
    },
  ],
};

export default grader;
