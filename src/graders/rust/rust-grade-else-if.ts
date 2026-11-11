import type { RustGraderDef } from "../../grade/types";

const grader: RustGraderDef = {
  kind: "rust",
  mode: "harness",
  cases: [
    { label: "A", expr: "grade(95)", expected: "'A'" },
    { label: "ちょうど 90 は A", expr: "grade(90)", expected: "'A'" },
    { label: "ちょうど 70 は B", expr: "grade(70)", expected: "'B'" },
    { label: "C", expr: "grade(55)", expected: "'C'" },
    { label: "境界 49 は F", expr: "grade(49)", expected: "'F'" },
    { label: "0 点", expr: "grade(0)", expected: "'F'" },
  ],
};

export default grader;
