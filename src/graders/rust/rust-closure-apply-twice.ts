import type { RustGraderDef } from "../../grade/types";

const grader: RustGraderDef = {
  kind: "rust",
  mode: "harness",
  cases: [
    { label: "足し算を 2 回", expr: "apply_twice(|x| x + 3, 1)", expected: "7" },
    { label: "2 乗を 2 回", expr: "apply_twice(|x| x * x, 3)", expected: "81" },
    {
      label: "キャプチャしたクロージャ",
      expr: "{ let k = 10; apply_twice(|x| x + k, 0) }",
      expected: "20",
    },
    {
      label: "関数を渡す",
      expr: "{ fn neg(x: i32) -> i32 { -x } apply_twice(neg, 5) }",
      expected: "5",
    },
    { label: "n 回", expr: "apply_n(|x| x * 2, 1, 10)", expected: "1024" },
    { label: "0 回", expr: "apply_n(|x| x + 100, 7, 0)", expected: "7" },
  ],
};

export default grader;
