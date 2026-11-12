import type { RustGraderDef } from "../../grade/types";

const grader: RustGraderDef = {
  kind: "rust",
  mode: "harness",
  cases: [
    {
      label: "値として等しい",
      expr: "(f(1, 2) == f(2, 4), f(1, 2) != f(2, 3))",
      expected: "(true, true)",
    },
    {
      label: "大小比較",
      expr: "(f(1, 3) < f(1, 2), f(3, 4) > f(2, 3), f(2, 4) <= f(1, 2))",
      expected: "(true, true, true)",
    },
    {
      label: "負の分母",
      expr: "(f(-1, 2) < f(1, -3), f(1, -2) == f(-1, 2))",
      expected: "(true, true)",
    },
    { label: "掛け算", expr: "f(1, 2) * f(2, 3) == f(1, 3)", expected: "true" },
    { label: "partial_cmp の結果", expr: "f(2, 6).partial_cmp(&f(1, 3))", expected: "Some(Equal)" },
  ],
};

export default grader;
