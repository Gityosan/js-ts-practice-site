import type { RustGraderDef } from "../../grade/types";

const grader: RustGraderDef = {
  kind: "rust",
  mode: "harness",
  cases: [
    {
      label: "3 ワーカー",
      expr: "sum_by_workers(vec![vec![1, 2], vec![3], vec![4, 5, 6]])",
      expected: "(21, 3)",
    },
    {
      label: "空の担当もある",
      expr: "sum_by_workers(vec![vec![], vec![10]])",
      expected: "(10, 2)",
    },
    { label: "ワーカー 0 人", expr: "sum_by_workers(vec![])", expected: "(0, 0)" },
    {
      label: "たくさんのワーカー",
      expr: "sum_by_workers((1..=20).map(|i| vec![i]).collect())",
      expected: "(210, 20)",
    },
  ],
};

export default grader;
