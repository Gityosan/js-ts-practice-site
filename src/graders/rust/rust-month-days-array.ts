import type { RustGraderDef } from "../../grade/types";

const grader: RustGraderDef = {
  kind: "rust",
  mode: "harness",
  cases: [
    { label: "1 月", expr: "days_in_month(1)", expected: "31" },
    { label: "2 月", expr: "days_in_month(2)", expected: "28" },
    { label: "4 月", expr: "days_in_month(4)", expected: "30" },
    { label: "12 月", expr: "days_in_month(12)", expected: "31" },
    { label: "9 月", expr: "days_in_month(9)", expected: "30" },
  ],
};

export default grader;
