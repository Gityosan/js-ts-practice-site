import type { RustGraderDef } from "../../grade/types";

const grader: RustGraderDef = {
  kind: "rust",
  mode: "harness",
  cases: [
    { label: "2 倍", expr: "{ let mut a = 5; double_in_place(&mut a); a }", expected: "10" },
    {
      label: "2 回呼ぶと 4 倍",
      expr: "{ let mut a = -3; double_in_place(&mut a); double_in_place(&mut a); a }",
      expected: "-12",
    },
    {
      label: "入れ替え",
      expr: "{ let mut x = 1; let mut y = 2; swap_values(&mut x, &mut y); (x, y) }",
      expected: "(2, 1)",
    },
    {
      label: "同じ値の入れ替え",
      expr: "{ let mut x = 7; let mut y = 7; swap_values(&mut x, &mut y); (x, y) }",
      expected: "(7, 7)",
    },
  ],
};

export default grader;
