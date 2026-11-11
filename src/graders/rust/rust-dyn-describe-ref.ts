import type { RustGraderDef } from "../../grade/types";

const grader: RustGraderDef = {
  kind: "rust",
  mode: "harness",
  cases: [
    { label: "i32", expr: "5.describe()", expected: '"int 5"' },
    { label: "bool", expr: "(true.describe(), false.describe())", expected: '("yes", "no")' },
    { label: "String", expr: 'String::from("hi").describe()', expected: "\"text 'hi'\"" },
    {
      label: "混ぜて並べる",
      expr: '{ let s = String::from("hi"); describe_all(&[&5, &true, &s, &Point { x: 1, y: 2 }]) }',
      expected: "\"int 5, yes, text 'hi', point (1, 2)\"",
    },
    { label: "空", expr: "describe_all(&[])", expected: '""' },
  ],
};

export default grader;
