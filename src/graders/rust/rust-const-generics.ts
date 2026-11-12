import type { RustGraderDef } from "../../grade/types";

const grader: RustGraderDef = {
  kind: "rust",
  mode: "harness",
  cases: [
    { label: "長さ 3 の合計", expr: "sum_array([1, 2, 3])", expected: "6" },
    { label: "長さ 4 の合計", expr: "sum_array([10, 20, 30, 40])", expected: "100" },
    { label: "長さ 0 の合計", expr: "sum_array([])", expected: "0" },
    {
      label: "first_last（char）",
      expr: "first_last(['a', 'b', 'c'])",
      expected: "Some(('a', 'c'))",
    },
    { label: "first_last（1 要素）", expr: "first_last([7])", expected: "Some((7, 7))" },
    { label: "first_last（空）", expr: "first_last::<i32, 0>([])", expected: "None" },
  ],
};

export default grader;
