import type { RustGraderDef } from "../../grade/types";

const grader: RustGraderDef = {
  kind: "rust",
  mode: "harness",
  cases: [
    { label: "真ん中", expr: "middle(&[1, 2, 3, 4, 5])", expected: "[2, 3, 4]" },
    { label: "3 個なら 1 個", expr: "middle(&[7, 8, 9])", expected: "[8]" },
    {
      label: "2 個以下は空",
      expr: "(middle(&[1, 2]), middle(&[1]), middle(&[]))",
      expected: "([], [], [])",
    },
    { label: "偶数個を半分に", expr: "halves(&[1, 2, 3, 4])", expected: "([1, 2], [3, 4])" },
    { label: "奇数個は後半が多い", expr: "halves(&[1, 2, 3])", expected: "([1], [2, 3])" },
    { label: "空", expr: "halves(&[])", expected: "([], [])" },
  ],
};

export default grader;
