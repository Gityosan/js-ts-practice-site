import type { RustGraderDef } from "../../grade/types";

const grader: RustGraderDef = {
  kind: "rust",
  mode: "harness",
  cases: [
    {
      label: "4 で割り切れる",
      expr: "(is_leap_year(2024), is_leap_year(2023))",
      expected: "(true, false)",
    },
    {
      label: "100 で割り切れる",
      expr: "(is_leap_year(1900), is_leap_year(2100))",
      expected: "(false, false)",
    },
    {
      label: "400 で割り切れる",
      expr: "(is_leap_year(2000), is_leap_year(1600))",
      expected: "(true, true)",
    },
    {
      label: "2 月の日数",
      expr: "(days_in_month(2024, 2), days_in_month(2023, 2), days_in_month(1900, 2))",
      expected: "(29, 28, 28)",
    },
    {
      label: "30 日と 31 日の月",
      expr: "(1..=12).map(|m| days_in_month(2023, m)).collect::<Vec<_>>()",
      expected: "[31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]",
    },
  ],
};

export default grader;
