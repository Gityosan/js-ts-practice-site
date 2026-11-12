import type { RustGraderDef } from "../../grade/types";

const grader: RustGraderDef = {
  kind: "rust",
  mode: "harness",
  cases: [
    { label: "1〜4 の合計", expr: "sum_to(4)", expected: "10" },
    { label: "1〜100 の合計", expr: "sum_to(100)", expected: "5050" },
    { label: "n = 1", expr: "sum_to(1)", expected: "1" },
    { label: "n = 0 は 0", expr: "sum_to(0)", expected: "0" },
  ],
};

export default grader;
