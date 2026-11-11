import type { RustGraderDef } from "../../grade/types";

const grader: RustGraderDef = {
  kind: "rust",
  mode: "harness",
  cases: [
    {
      label: "真ん中に挿入",
      expr: "{ let mut v = vec![1, 3, 5]; let p = insert_sorted(&mut v, 4); (p, v) }",
      expected: "(2, [1, 3, 4, 5])",
    },
    {
      label: "先頭と空に挿入",
      expr: "{ let mut v = vec![]; let a = insert_sorted(&mut v, 7); let b = insert_sorted(&mut v, 2); (a, b, v) }",
      expected: "(0, 0, [2, 7])",
    },
    { label: "すべて含む", expr: "contains_all(&[1, 2, 4, 8, 16], &[16, 1, 4])", expected: "true" },
    { label: "1 つ足りない", expr: "contains_all(&[1, 2, 4], &[2, 3])", expected: "false" },
    {
      label: "長さ順 → 辞書順",
      expr: '{ let mut w: Vec<String> = ["pear", "fig", "apple", "kiwi"].iter().map(|s| s.to_string()).collect(); sort_words(&mut w); w }',
      expected: '["fig", "kiwi", "pear", "apple"]',
    },
    {
      label: "f64 のソート",
      expr: "{ let mut v = vec![2.5, -1.0, 3.75, 0.0]; sort_floats(&mut v); v }",
      expected: "[-1.0, 0.0, 2.5, 3.75]",
    },
  ],
};

export default grader;
