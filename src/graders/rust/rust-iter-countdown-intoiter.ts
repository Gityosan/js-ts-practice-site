import type { RustGraderDef } from "../../grade/types";

const grader: RustGraderDef = {
  kind: "rust",
  mode: "harness",
  cases: [
    {
      label: "for で集める",
      expr: "{ let mut v = Vec::new(); for x in Countdown(3) { v.push(x); } v }",
      expected: "[3, 2, 1]",
    },
    { label: "into_iter から sum", expr: "Countdown(4).into_iter().sum::<u32>()", expected: "10" },
    { label: "0 は空", expr: "Countdown(0).into_iter().count()", expected: "0" },
    { label: "launch", expr: "launch(3)", expected: '"3 2 1 Liftoff!"' },
    { label: "launch(0)", expr: "launch(0)", expected: '"Liftoff!"' },
  ],
};

export default grader;
