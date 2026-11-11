import type { RustGraderDef } from "../../grade/types";

const grader: RustGraderDef = {
  kind: "rust",
  mode: "harness",
  cases: [
    { label: "先頭と末尾", expr: "first_last([10, 20, 30, 40, 50])", expected: "(10, 50)" },
    { label: "負の数", expr: "first_last([-1, 0, 0, 0, -9])", expected: "(-1, -9)" },
    { label: "偶数番目の合計", expr: "sum_even_positions([1, 2, 3, 4, 5])", expected: "9" },
    { label: "全部 0", expr: "sum_even_positions([0; 5])", expected: "0" },
  ],
};

export default grader;
