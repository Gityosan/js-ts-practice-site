import type { RustGraderDef } from "../../grade/types";

const grader: RustGraderDef = {
  kind: "rust",
  mode: "harness",
  cases: [
    {
      label: "読める",
      expr: '(parse_point("3,-4"), parse_point(" 3 , -4 "))',
      expected: "(Ok((3, -4)), Ok((3, -4)))",
    },
    {
      label: "読めない",
      expr: '(parse_point("1;2"), parse_point("1,x"))',
      expected: '(Err("missing comma"), Err("bad number: x"))',
    },
    { label: "テスト成功", expr: 'check_point("1,2", (1, 2))', expected: "Ok(())" },
    {
      label: "値が違えば Err",
      expr: 'check_point("1,2", (2, 1))',
      expected: 'Err("expected (2, 1), got (1, 2)")',
    },
    {
      label: "? で parse のエラーが返る",
      expr: 'check_point("1;2", (1, 2))',
      expected: 'Err("missing comma")',
    },
    {
      label: "まとめて実行",
      expr: '(run_all(&[("0,0", (0, 0)), ("5,6", (5, 6))]), run_all(&[("0,0", (0, 0)), ("5,6", (6, 5)), ("x", (0, 0))]))',
      expected: '(Ok(2), Err("expected (6, 5), got (5, 6)"))',
    },
  ],
};

export default grader;
