import type { RustGraderDef } from "../../grade/types";

const grader: RustGraderDef = {
  kind: "rust",
  mode: "harness",
  cases: [
    { label: "2 乗の Vec", expr: "(build(4), build(0))", expected: "([1, 4, 9, 16], [])" },
    {
      label: "左に回す",
      expr: "{ let mut v = vec![1, 2, 3]; rotate_left_once(&mut v); v }",
      expected: "[2, 3, 1]",
    },
    {
      label: "空なら何もしない",
      expr: "{ let mut v: Vec<i32> = vec![]; rotate_left_once(&mut v); v }",
      expected: "[]",
    },
    {
      label: "順序を保って挿入",
      expr: "{ let mut v = vec![1, 3, 7]; insert_sorted(&mut v, 5); insert_sorted(&mut v, 0); insert_sorted(&mut v, 9); v }",
      expected: "[0, 1, 3, 5, 7, 9]",
    },
    {
      label: "空の Vec に挿入",
      expr: "{ let mut v = vec![]; insert_sorted(&mut v, 4); v }",
      expected: "[4]",
    },
    {
      label: "範囲外は既定値",
      expr: "(nth_or(&[10, 20], 1, -1), nth_or(&[10, 20], 5, -1))",
      expected: "(20, -1)",
    },
  ],
};

export default grader;
