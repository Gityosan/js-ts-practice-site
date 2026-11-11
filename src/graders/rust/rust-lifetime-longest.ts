import type { RustGraderDef } from "../../grade/types";

const grader: RustGraderDef = {
  kind: "rust",
  mode: "harness",
  cases: [
    { label: "a が長い", expr: 'longest("apple", "fig")', expected: '"apple"' },
    { label: "b が長い", expr: 'longest("a", "banana")', expected: '"banana"' },
    { label: "同じ長さは a", expr: 'longest("hi", "yo")', expected: '"hi"' },
    { label: "空文字列", expr: 'longest("", "")', expected: '""' },
    {
      label: "String から借りる",
      expr: '{ let s1 = String::from("long string"); let r; { let s2 = String::from("xyz"); r = longest(s1.as_str(), s2.as_str()).to_string(); } r }',
      expected: '"long string"',
    },
  ],
};

export default grader;
