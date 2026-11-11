import type { RustGraderDef } from "../../grade/types";

const grader: RustGraderDef = {
  kind: "rust",
  mode: "harness",
  cases: [
    { label: "平均", expr: "average(&[1, 2])", expected: "1.5" },
    { label: "平均（空）", expr: "average(&[])", expected: "0.0" },
    { label: "切り捨て（正・負）", expr: "(trunc(3.99), trunc(-2.7))", expected: "(3, -2)" },
    { label: "char → u32", expr: "(code_of('A'), code_of('あ'))", expected: "(65, 12354)" },
    { label: "u8 → char", expr: "from_byte(97)", expected: "'a'" },
    {
      label: "折り返し",
      expr: "(low_byte(300), low_byte(255), low_byte(-1))",
      expected: "(44, 255, 255)",
    },
  ],
};

export default grader;
