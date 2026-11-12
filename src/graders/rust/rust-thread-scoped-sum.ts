import type { RustGraderDef } from "../../grade/types";

const grader: RustGraderDef = {
  kind: "rust",
  mode: "harness",
  cases: [
    {
      label: "1..=100 の合計",
      expr: "{ let v: Vec<i64> = (1..=100).collect(); parallel_sum(&v, 4) }",
      expected: "5050",
    },
    { label: "空", expr: "parallel_sum(&[], 3)", expected: "0" },
    { label: "1 分割", expr: "parallel_sum(&[5, -2, 7], 1)", expected: "10" },
    {
      label: "その場で 2 倍",
      expr: "{ let mut v = vec![1, 2, 3, 4, 5]; double_in_place(&mut v, 2); v }",
      expected: "[2, 4, 6, 8, 10]",
    },
    {
      label: "分割数が多すぎる",
      expr: "{ let mut v = vec![-3, 0]; double_in_place(&mut v, 8); v }",
      expected: "[-6, 0]",
    },
  ],
};

export default grader;
