import type { RustGraderDef } from "../../grade/types";

const grader: RustGraderDef = {
  kind: "rust",
  mode: "harness",
  cases: [
    { label: "sum 0 個", expr: "sum!()", expected: "0" },
    { label: "sum 3 個", expr: "sum!(1, 2, 3)", expected: "6" },
    { label: "sum 式も渡せる", expr: "sum!(10 * 2, -5, 1 + 1)", expected: "17" },
    { label: "str_vec 末尾カンマ", expr: 'str_vec!["a", "b",]', expected: '["a", "b"]' },
    { label: "str_vec 数値", expr: "str_vec![1, 2]", expected: '["1", "2"]' },
    { label: "str_vec 空", expr: "str_vec![]", expected: "[]" },
  ],
};

export default grader;
