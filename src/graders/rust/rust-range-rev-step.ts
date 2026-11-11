import type { RustGraderDef } from "../../grade/types";

const grader: RustGraderDef = {
  kind: "rust",
  mode: "harness",
  cases: [
    { label: "1〜10 の合計", expr: "sum_to(10)", expected: "55" },
    { label: "n = 0 は 0", expr: "sum_to(0)", expected: "0" },
    { label: "3 の倍数の合計", expr: "sum_multiples(10, 3)", expected: "18" },
    { label: "n 自身も倍数", expr: "sum_multiples(10, 5)", expected: "15" },
    { label: "最大の倍数", expr: "largest_multiple(20, 7)", expected: "14" },
    { label: "倍数がない", expr: "largest_multiple(5, 9)", expected: "0" },
  ],
};

export default grader;
