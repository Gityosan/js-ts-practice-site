import type { RustGraderDef } from "../../grade/types";

const grader: RustGraderDef = {
  kind: "rust",
  mode: "harness",
  cases: [
    {
      label: "年齢区分",
      expr: "[age_group(0), age_group(6), age_group(15), age_group(20)]",
      expected: '["0歳: 幼児", "6歳: 子ども", "15歳: 十代", "20歳: 大人"]',
    },
    {
      label: "境界",
      expr: "(age_group(5), age_group(12), age_group(19))",
      expected: '("5歳: 幼児", "12歳: 子ども", "19歳: 十代")',
    },
    {
      label: "FizzBuzz",
      expr: '(1..=15).map(fizzbuzz).collect::<Vec<_>>().join(" ")',
      expected: '"1 2 Fizz 4 Buzz Fizz 7 8 Fizz Buzz 11 Fizz 13 14 FizzBuzz"',
    },
    {
      label: "比較",
      expr: "[compare((2, 2)), compare((3, -3)), compare((5, 1)), compare((1, 5))]",
      expected: '["同じ", "逆符号", "左が大", "右が大"]',
    },
    { label: "0 と 0 は同じ", expr: "compare((0, 0))", expected: '"同じ"' },
  ],
};

export default grader;
