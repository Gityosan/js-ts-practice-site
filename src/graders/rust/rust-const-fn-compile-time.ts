import type { RustGraderDef } from "../../grade/types";

const grader: RustGraderDef = {
  kind: "rust",
  mode: "harness",
  cases: [
    { label: "const の中で cube", expr: "{ const C: i64 = cube(3); C }", expected: "27" },
    { label: "負の数の cube（実行時）", expr: "cube(-2)", expected: "-8" },
    { label: "fib(10) をコンパイル時に", expr: "{ const F: u64 = fib(10); F }", expected: "55" },
    { label: "fib(0) と fib(1)", expr: "(fib(0), fib(1))", expected: "(0, 1)" },
    {
      label: "squares の配列",
      expr: "{ const S: [u32; 5] = squares(); S }",
      expected: "[0, 1, 4, 9, 16]",
    },
    { label: "長さ 0", expr: "{ const S: [u32; 0] = squares(); S }", expected: "[]" },
  ],
};

export default grader;
