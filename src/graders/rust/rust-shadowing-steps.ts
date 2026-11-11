import type { RustGraderDef } from "../../grade/types";

const grader: RustGraderDef = {
  kind: "rust",
  mode: "harness",
  cases: [
    { label: "x = 2", expr: "steps(2)", expected: "5" },
    { label: "x = 0 は負になる", expr: "steps(0)", expected: "-1" },
    { label: "x = 10", expr: "steps(10)", expected: "29" },
    { label: "負の入力", expr: "steps(-5)", expected: "-16" },
  ],
};

export default grader;
