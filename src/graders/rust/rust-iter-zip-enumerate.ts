import type { RustGraderDef } from "../../grade/types";

const grader: RustGraderDef = {
  kind: "rust",
  mode: "harness",
  cases: [
    { label: "内積", expr: "dot(&[1, 2, 3], &[4, 5, 6])", expected: "32" },
    { label: "長さが違う", expr: "dot(&[1, 2, 3], &[10])", expected: "10" },
    { label: "空", expr: "dot(&[], &[1, 2])", expected: "0" },
    { label: "位置の一覧", expr: "indices_of(&[7, 1, 7, 7, 2], 7)", expected: "[0, 2, 3]" },
    { label: "見つからない", expr: "indices_of(&[1, 2], 9)", expected: "[]" },
    {
      label: "番号付け",
      expr: 'numbered(&["apple", "banana"])',
      expected: '["1. apple", "2. banana"]',
    },
  ],
};

export default grader;
