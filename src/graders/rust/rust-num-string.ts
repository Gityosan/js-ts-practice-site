import type { RustGraderDef } from "../../grade/types";

const grader: RustGraderDef = {
  kind: "rust",
  mode: "harness",
  cases: [
    {
      label: "parse_or_zero",
      expr: '(parse_or_zero(" 42 "), parse_or_zero("-7"), parse_or_zero("x"), parse_or_zero(""))',
      expected: "(42, -7, 0, 0)",
    },
    {
      label: "digit_sum",
      expr: "(digit_sum(1234), digit_sum(0), digit_sum(99999))",
      expected: "(10, 0, 45)",
    },
    {
      label: "from_binary",
      expr: '(from_binary("1010"), from_binary("0"), from_binary("102"))',
      expected: "(Some(10), Some(0), None)",
    },
    {
      label: "to_padded",
      expr: "(to_padded(7), to_padded(1234), to_padded(56789))",
      expected: '("0007", "1234", "56789")',
    },
  ],
};

export default grader;
