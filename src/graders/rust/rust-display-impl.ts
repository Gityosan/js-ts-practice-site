import type { RustGraderDef } from "../../grade/types";

const grader: RustGraderDef = {
  kind: "rust",
  mode: "harness",
  cases: [
    { label: "Point", expr: "Point { x: 1, y: -2 }.to_string()", expected: '"(1, -2)"' },
    {
      label: "format! の中で",
      expr: 'format!("P={}", Point { x: 0, y: 0 })',
      expected: '"P=(0, 0)"',
    },
    { label: "分数", expr: "Fraction { num: 3, den: 4 }.to_string()", expected: '"3/4"' },
    { label: "分母が 1", expr: "Fraction { num: 5, den: 1 }.to_string()", expected: '"5"' },
    { label: "負の分数", expr: "Fraction { num: -1, den: 2 }.to_string()", expected: '"-1/2"' },
  ],
};

export default grader;
