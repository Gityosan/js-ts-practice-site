import type { RustGraderDef } from "../../grade/types";

const grader: RustGraderDef = {
  kind: "rust",
  mode: "harness",
  cases: [
    {
      label: "平均",
      expr: "(mean(&[1, 2, 3, 4]), mean(&[-3, 3, 6]))",
      expected: "(Some(2.5), Some(2.0))",
    },
    { label: "空の平均", expr: "mean(&[])", expected: "None" },
    { label: "中央値（奇数個・未ソート）", expr: "median(&[5, 1, 3])", expected: "Some(3.0)" },
    {
      label: "中央値（偶数個）",
      expr: "(median(&[4, 1, 3, 2]), median(&[7]))",
      expected: "(Some(2.5), Some(7.0))",
    },
    {
      label: "最頻値（同数なら小さい方）",
      expr: "(mode(&[3, 1, 3, 1, 2]), mode(&[5, 5, 2]))",
      expected: "(Some(1), Some(5))",
    },
    { label: "空の中央値・最頻値", expr: "(median(&[]), mode(&[]))", expected: "(None, None)" },
  ],
};

export default grader;
