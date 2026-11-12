import type { RustGraderDef } from "../../grade/types";

const grader: RustGraderDef = {
  kind: "rust",
  mode: "harness",
  cases: [
    { label: "x = 3", expr: "scope_demo(3)", expected: "(31, 3)" },
    { label: "x = 0", expr: "scope_demo(0)", expected: "(1, 0)" },
    { label: "負の数", expr: "scope_demo(-2)", expected: "(-19, -2)" },
  ],
};

export default grader;
