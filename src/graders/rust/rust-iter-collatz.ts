import type { RustGraderDef } from "../../grade/types";

const grader: RustGraderDef = {
  kind: "rust",
  mode: "harness",
  cases: [
    {
      label: "6 から",
      expr: "Collatz::new(6).collect::<Vec<_>>()",
      expected: "[6, 3, 10, 5, 16, 8, 4, 2, 1]",
    },
    { label: "1 から", expr: "Collatz::new(1).collect::<Vec<_>>()", expected: "[1]" },
    {
      label: "終わった後も None",
      expr: "{ let mut c = Collatz::new(2); (c.next(), c.next(), c.next(), c.next()) }",
      expected: "(Some(2), Some(1), None, None)",
    },
    { label: "steps", expr: "(steps(1), steps(6), steps(27))", expected: "(0, 8, 111)" },
    { label: "longest_start", expr: "(longest_start(10), longest_start(1))", expected: "(9, 1)" },
  ],
};

export default grader;
