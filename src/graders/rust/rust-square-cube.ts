import type { RustGraderDef } from "../../grade/types";

const grader: RustGraderDef = {
  kind: "rust",
  mode: "harness",
  cases: [
    { label: "2 乗", expr: "square(4)", expected: "16" },
    { label: "負の数の 2 乗", expr: "square(-5)", expected: "25" },
    { label: "3 乗", expr: "cube(3)", expected: "27" },
    { label: "負の数の 3 乗", expr: "cube(-2)", expected: "-8" },
    { label: "0", expr: "(square(0), cube(0))", expected: "(0, 0)" },
    { label: "大きめの値", expr: "cube(1000)", expected: "1000000000" },
  ],
};

export default grader;
