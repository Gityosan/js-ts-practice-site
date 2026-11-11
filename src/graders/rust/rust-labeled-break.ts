import type { RustGraderDef } from "../../grade/types";

const grader: RustGraderDef = {
  kind: "rust",
  mode: "harness",
  cases: [
    { label: "12 = 2 × 6", expr: "find_factors(12)", expected: "(2, 6)" },
    { label: "素数 7", expr: "find_factors(7)", expected: "(1, 7)" },
    { label: "見つからない", expr: "find_factors(11)", expected: "(0, 0)" },
    { label: "81 = 9 × 9", expr: "find_factors(81)", expected: "(9, 9)" },
    { label: "1 = 1 × 1", expr: "find_factors(1)", expected: "(1, 1)" },
    { label: "24 = 3 × 8", expr: "find_factors(24)", expected: "(3, 8)" },
  ],
};

export default grader;
