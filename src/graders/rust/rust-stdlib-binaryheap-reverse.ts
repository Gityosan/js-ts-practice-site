import type { RustGraderDef } from "../../grade/types";

const grader: RustGraderDef = {
  kind: "rust",
  mode: "harness",
  cases: [
    { label: "上位 3 件", expr: "top_k(&[5, 1, 9, 3, 7], 3)", expected: "[9, 7, 5]" },
    { label: "k が多すぎる", expr: "top_k(&[2, 1], 5)", expected: "[2, 1]" },
    { label: "小さい順に 2 件", expr: "k_smallest(&[5, 1, 9, 3, 7], 2)", expected: "[1, 3]" },
    { label: "k = 0", expr: "k_smallest(&[4, 2], 0)", expected: "[]" },
    {
      label: "タスクの処理順",
      expr: 'process_tasks(&[(1, "wash"), (3, "deploy"), (3, "build"), (2, "test")])',
      expected: '["build", "deploy", "test", "wash"]',
    },
    { label: "タスクなし", expr: "process_tasks(&[])", expected: "[]" },
  ],
};

export default grader;
