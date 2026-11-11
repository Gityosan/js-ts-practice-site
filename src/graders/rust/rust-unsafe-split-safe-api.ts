import type { RustGraderDef } from "../../grade/types";

const grader: RustGraderDef = {
  kind: "rust",
  mode: "harness",
  cases: [
    {
      label: "偶数の長さ",
      expr: "{ let mut v = [1, 2, 3, 10, 20, 30]; add_second_half(&mut v); v }",
      expected: "[11, 22, 33, 10, 20, 30]",
    },
    {
      label: "奇数の長さ",
      expr: "{ let mut v = [1, 2, 5, 7, 9]; add_second_half(&mut v); v }",
      expected: "[6, 9, 5, 7, 9]",
    },
    { label: "1 要素", expr: "{ let mut v = [4]; add_second_half(&mut v); v }", expected: "[4]" },
    {
      label: "空",
      expr: "{ let mut v: [i32; 0] = []; add_second_half(&mut v); v }",
      expected: "[]",
    },
  ],
};

export default grader;
