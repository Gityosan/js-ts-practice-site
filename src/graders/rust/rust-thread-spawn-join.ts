import type { RustGraderDef } from "../../grade/types";

const grader: RustGraderDef = {
  kind: "rust",
  mode: "harness",
  cases: [
    { label: "基本", expr: "parallel_squares(vec![1, 2, 3])", expected: "[1, 4, 9]" },
    { label: "負の数", expr: "parallel_squares(vec![-4, 5])", expected: "[16, 25]" },
    { label: "空", expr: "parallel_squares(vec![])", expected: "[]" },
    {
      label: "要素が多い",
      expr: "parallel_squares((1..=10).collect())",
      expected: "[1, 4, 9, 16, 25, 36, 49, 64, 81, 100]",
    },
  ],
};

export default grader;
