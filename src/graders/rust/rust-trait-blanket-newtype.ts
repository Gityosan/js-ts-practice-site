import type { RustGraderDef } from "../../grade/types";

const grader: RustGraderDef = {
  kind: "rust",
  mode: "harness",
  cases: [
    { label: "Describe（整数）", expr: "42.describe()", expected: '"<42>"' },
    { label: "Describe（Vec）", expr: "vec![1, 2].describe()", expected: '"<[1, 2]>"' },
    { label: "Describe（&str）", expr: '"hi".describe()', expected: '"<\\"hi\\">"' },
    { label: "Total", expr: "vec![1, 2, 3].total()", expected: "6" },
    { label: "Total（空）", expr: "Vec::<i32>::new().total()", expected: "0" },
    {
      label: "Words の表示",
      expr: 'Words(vec!["hello".to_string(), "rust".to_string(), "world".to_string()]).to_string()',
      expected: '"hello rust world"',
    },
  ],
};

export default grader;
