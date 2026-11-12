import type { RustGraderDef } from "../../grade/types";

const grader: RustGraderDef = {
  kind: "rust",
  mode: "harness",
  cases: [
    {
      label: "基本",
      expr: "{ let mut v = vec![1, 2]; let f = push_and_first(&mut v, 3); (f, v) }",
      expected: "(1, [1, 2, 3])",
    },
    {
      label: "要素 1 つ",
      expr: "{ let mut v = vec![9]; let f = push_and_first(&mut v, 0); (f, v) }",
      expected: "(9, [9, 0])",
    },
    {
      label: "2 回呼ぶ",
      expr: "{ let mut v = vec![5]; push_and_first(&mut v, 6); let f = push_and_first(&mut v, 7); (f, v) }",
      expected: "(5, [5, 6, 7])",
    },
  ],
};

export default grader;
