import type { RustGraderDef } from "../../grade/types";

const grader: RustGraderDef = {
  kind: "rust",
  mode: "harness",
  cases: [
    { label: "i32", expr: "largest(&[3, 7, 2])", expected: "7" },
    { label: "負の数だけ", expr: "largest(&[-5, -1, -9])", expected: "-1" },
    { label: "f64", expr: "largest(&[1.5, -2.0, 0.25])", expected: "1.5" },
    { label: "char", expr: "largest(&['x', 'b', 'z', 'a'])", expected: "'z'" },
    { label: "1 要素", expr: "largest(&[42u8])", expected: "42" },
  ],
};

export default grader;
