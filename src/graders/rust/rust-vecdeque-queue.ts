import type { RustGraderDef } from "../../grade/types";

const grader: RustGraderDef = {
  kind: "rust",
  mode: "harness",
  cases: [
    {
      label: "待ち行列",
      expr: 'process(&[("a", 5), ("b", 2), ("c", 3)], 3)',
      expected: '["b", "c", "a"]',
    },
    { label: "全部すぐ終わる", expr: 'process(&[("x", 1), ("y", 1)], 10)', expected: '["x", "y"]' },
    { label: "何周も回る", expr: 'process(&[("big", 7), ("s", 1)], 2)', expected: '["s", "big"]' },
    { label: "空のキュー", expr: "process(&[], 3)", expected: "[]" },
    { label: "移動合計", expr: "moving_sum(&[1, 2, 3, 4], 2)", expected: "[1, 3, 5, 7]" },
    {
      label: "k が大きい・空",
      expr: "(moving_sum(&[5, -1, 2], 10), moving_sum(&[], 3))",
      expected: "([5, 4, 6], [])",
    },
  ],
};

export default grader;
