import type { RustGraderDef } from "../../grade/types";

const grader: RustGraderDef = {
  kind: "rust",
  mode: "harness",
  cases: [
    { label: "最初の偶数", expr: "first_even(&[1, 3, 4, 6])", expected: "Some(4)" },
    { label: "偶数がない", expr: "first_even(&[1, 3, 5])", expected: "None" },
    { label: "負の偶数", expr: "first_even(&[-3, -2])", expected: "Some(-2)" },
    {
      label: "位置を探す",
      expr: "(index_of(&[5, 7, 9, 7], 7), index_of(&[5], 1))",
      expected: "(Some(1), None)",
    },
    { label: "最大値", expr: "max_value(&[3, -1, 8, 2])", expected: "Some(8)" },
    { label: "空なら None", expr: "max_value(&[])", expected: "None" },
  ],
};

export default grader;
