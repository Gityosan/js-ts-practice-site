import type { RustGraderDef } from "../../grade/types";

const grader: RustGraderDef = {
  kind: "rust",
  mode: "harness",
  cases: [
    { expr: "add(2, 3)", expected: "5" },
    { expr: "add(-4, 10)", expected: "6" },
    { expr: "add(0, 0)", expected: "0" },
  ],
};

export default grader;
