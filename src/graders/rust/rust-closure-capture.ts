import type { RustGraderDef } from "../../grade/types";

const grader: RustGraderDef = {
  kind: "rust",
  mode: "harness",
  cases: [
    { label: "しきい値より大きい数", expr: "count_above(&[1, 5, 10, 3], 4)", expected: "2" },
    { label: "該当なし", expr: "count_above(&[1, 2], 100)", expected: "0" },
    { label: "累積和", expr: "running_total(&[1, 2, 3, 4])", expected: "[1, 3, 6, 10]" },
    { label: "累積和（空）", expr: "running_total(&[])", expected: "[]" },
    {
      label: "タグ付け",
      expr: 'tag_all(&["a", "b"], "x".to_string())',
      expected: '["a:x", "b:x"]',
    },
  ],
};

export default grader;
