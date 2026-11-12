import type { RustGraderDef } from "../../grade/types";

const grader: RustGraderDef = {
  kind: "rust",
  mode: "harness",
  cases: [
    { label: "4 スレッド × 1000 回", expr: "count_up(4, 1000)", expected: "4000" },
    { label: "1 スレッド", expr: "count_up(1, 5)", expected: "5" },
    { label: "0 スレッド", expr: "count_up(0, 100)", expected: "0" },
    { label: "ID を集める", expr: "collect_ids(5)", expected: "[0, 1, 2, 3, 4]" },
    { label: "ID 0 個", expr: "collect_ids(0)", expected: "[]" },
  ],
};

export default grader;
