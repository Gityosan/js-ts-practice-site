import type { RustGraderDef } from "../../grade/types";

const grader: RustGraderDef = {
  kind: "rust",
  mode: "harness",
  cases: [
    { label: "3/4", expr: 'format!("{}", Fraction { num: 3, den: 4 })', expected: '"3/4"' },
    { label: "負の分子", expr: 'format!("{}", Fraction { num: -1, den: 2 })', expected: '"-1/2"' },
    { label: "分母が 1", expr: 'format!("{}", Fraction { num: 5, den: 1 })', expected: '"5"' },
    {
      label: "to_string も使える",
      expr: "Fraction { num: 7, den: 3 }.to_string()",
      expected: '"7/3"',
    },
    {
      label: "文中に埋め込む",
      expr: 'format!("答えは {} です", Fraction { num: 1, den: 3 })',
      expected: '"答えは 1/3 です"',
    },
  ],
};

export default grader;
