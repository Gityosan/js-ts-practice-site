import type { RustGraderDef } from "../../grade/types";

const grader: RustGraderDef = {
  kind: "rust",
  mode: "harness",
  cases: [
    {
      label: "3 回呼ぶ",
      expr: "{ let mut c = make_counter(); (c(), c(), c()) }",
      expected: "(1, 2, 3)",
    },
    {
      label: "カウンタは独立",
      expr: "{ let mut a = make_counter(); let mut b = make_counter(); a(); a(); (a(), b()) }",
      expected: "(3, 1)",
    },
    { label: "call_n", expr: "call_n(make_counter(), 3)", expected: "[1, 2, 3]" },
    { label: "call_n 0 回", expr: "call_n(make_counter(), 0)", expected: "[]" },
    {
      label: "自作の FnMut も渡せる",
      expr: "{ let mut x = 10; call_n(move || { x *= 2; x }, 3) }",
      expected: "[20, 40, 80]",
    },
  ],
};

export default grader;
