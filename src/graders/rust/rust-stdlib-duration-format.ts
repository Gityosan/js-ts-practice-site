import type { RustGraderDef } from "../../grade/types";

const grader: RustGraderDef = {
  kind: "rust",
  mode: "harness",
  cases: [
    {
      label: "hms 1 時間 2 分 5 秒",
      expr: "hms(Duration::from_secs(3725))",
      expected: '"01:02:05"',
    },
    { label: "hms 0 秒", expr: "hms(Duration::ZERO)", expected: '"00:00:00"' },
    { label: "hms 100 時間", expr: "hms(Duration::from_secs(360000))", expected: '"100:00:00"' },
    { label: "カンマ区切り", expr: "with_commas(1234567)", expected: '"1,234,567"' },
    {
      label: "3 桁以下と 0",
      expr: "(with_commas(999), with_commas(0), with_commas(1000))",
      expected: '("999", "0", "1,000")',
    },
    { label: "ラップの合計", expr: "total_time(&[1500, 2250, 300])", expected: '"4.050s"' },
    { label: "ラップなし", expr: "total_time(&[])", expected: '"0.000s"' },
  ],
};

export default grader;
