import type { RustGraderDef } from "../../grade/types";

const grader: RustGraderDef = {
  kind: "rust",
  mode: "harness",
  cases: [
    { label: "真ん中", expr: "marked(2, 9)", expected: "[0, 0, 9, 0, 0]" },
    { label: "先頭に負の数", expr: "marked(0, -1)", expected: "[-1, 0, 0, 0, 0]" },
    { label: "末尾", expr: "marked(4, 7)", expected: "[0, 0, 0, 0, 7]" },
    { label: "単位行列", expr: "identity3()", expected: "[[1, 0, 0], [0, 1, 0], [0, 0, 1]]" },
  ],
};

export default grader;
