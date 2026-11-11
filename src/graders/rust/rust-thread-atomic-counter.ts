import type { RustGraderDef } from "../../grade/types";

const grader: RustGraderDef = {
  kind: "rust",
  mode: "harness",
  cases: [
    {
      label: "1..=100 を 4 スレッド",
      expr: "count_even_parallel((1..=100).collect(), 4)",
      expected: "50",
    },
    {
      label: "割り切れない分け方",
      expr: "count_even_parallel(vec![2, 4, 6, 7, 9], 2)",
      expected: "3",
    },
    { label: "偶数なし", expr: "count_even_parallel(vec![1, 3, 5], 3)", expected: "0" },
    { label: "空のデータ", expr: "count_even_parallel(vec![], 4)", expected: "0" },
    {
      label: "スレッド数が要素数より多い",
      expr: "count_even_parallel(vec![2, 8], 10)",
      expected: "2",
    },
  ],
};

export default grader;
