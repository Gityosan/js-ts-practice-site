import type { RustGraderDef } from "../../grade/types";

const grader: RustGraderDef = {
  kind: "rust",
  mode: "harness",
  cases: [
    { label: "基本", expr: "min_max(&[3, 1, 4, 1, 5, 9, 2])", expected: "(1, 9)" },
    { label: "1 要素", expr: "min_max(&[42])", expected: "(42, 42)" },
    { label: "すべて負", expr: "min_max(&[-5, -2, -9])", expected: "(-9, -2)" },
    {
      label: "Vec の一部",
      expr: "{ let v = vec![100, 7, 8, -100]; min_max(&v[1..3]) }",
      expected: "(7, 8)",
    },
  ],
};

export default grader;
