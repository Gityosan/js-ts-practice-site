import type { RustGraderDef } from "../../grade/types";

const grader: RustGraderDef = {
  kind: "rust",
  mode: "harness",
  cases: [
    { label: "a が長い", expr: 'first_of("hello", "hi")', expected: '"hello"' },
    { label: "a が短い", expr: 'first_of("hi", "hello")', expected: '"h"' },
    {
      label: "b が先に破棄されても使える",
      expr: '{ let a = String::from("abcdef"); let r; { let b = String::from("xyz"); r = first_of(&a, &b); } r.to_string() }',
      expected: '"abcdef"',
    },
    {
      label: "key = value",
      expr: 'split_key_value(" name = Ferris ")',
      expected: 'Some(("name", "Ferris"))',
    },
    { label: "= がない", expr: 'split_key_value("novalue")', expected: "None" },
    { label: "値が空", expr: 'split_key_value("k=")', expected: 'Some(("k", ""))' },
  ],
};

export default grader;
