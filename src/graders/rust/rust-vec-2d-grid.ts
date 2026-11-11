import type { RustGraderDef } from "../../grade/types";

const grader: RustGraderDef = {
  kind: "rust",
  mode: "harness",
  cases: [
    { label: "行列を作る", expr: "make_grid(2, 3)", expected: "[[0, 1, 2], [3, 4, 5]]" },
    { label: "行の合計", expr: "row_sums(&make_grid(2, 3))", expected: "[3, 12]" },
    { label: "列の合計", expr: "col_sums(&make_grid(2, 3))", expected: "[3, 5, 7]" },
    { label: "転置", expr: "transpose(&make_grid(2, 3))", expected: "[[0, 3], [1, 4], [2, 5]]" },
    { label: "1 行の転置", expr: "transpose(&[vec![1, 2, 3]])", expected: "[[1], [2], [3]]" },
    {
      label: "空の行列",
      expr: "(make_grid(0, 3), col_sums(&[]), transpose(&[]))",
      expected: "([], [], [])",
    },
  ],
};

export default grader;
