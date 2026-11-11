import type { RustGraderDef } from "../../grade/types";

const grader: RustGraderDef = {
  kind: "rust",
  mode: "harness",
  cases: [
    { label: "math::add", expr: "math::add(2, 3)", expected: "5" },
    { label: "math::square", expr: "math::square(-4)", expected: "16" },
    { label: "math::stats::mean", expr: "math::stats::mean(&[1, 2, 3, 4])", expected: "Some(2.5)" },
    { label: "空の平均", expr: "math::stats::mean(&[])", expected: "None" },
    {
      label: "math::stats::max",
      expr: "(math::stats::max(&[3, 9, -1]), math::stats::max(&[]))",
      expected: "(Some(9), None)",
    },
  ],
};

export default grader;
