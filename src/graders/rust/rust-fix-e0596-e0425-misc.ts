import type { RustGraderDef } from "../../grade/types";

const grader: RustGraderDef = {
  kind: "rust",
  mode: "harness",
  cases: [
    {
      label: "push_twice",
      expr: "{ let mut v = vec![0]; push_twice(&mut v, 5); v }",
      expected: "[0, 5, 5]",
    },
    { label: "build(2)", expr: "build(2)", expected: "[1, 1, 2, 2]" },
    { label: "build(0)", expr: "build(0)", expected: "[]" },
    { label: "sum_to(10)", expr: "sum_to(10)", expected: "55" },
    { label: "sum_to(0)", expr: "sum_to(0)", expected: "0" },
  ],
};

export default grader;
