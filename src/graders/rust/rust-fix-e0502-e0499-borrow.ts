import type { RustGraderDef } from "../../grade/types";

const grader: RustGraderDef = {
  kind: "rust",
  mode: "harness",
  cases: [
    {
      label: "先頭を末尾に追加",
      expr: "{ let mut v = vec![7, 8]; let r = append_first(&mut v); (r, v) }",
      expected: "(Some(7), [7, 8, 7])",
    },
    {
      label: "空なら何もしない",
      expr: "{ let mut v: Vec<i32> = vec![]; let r = append_first(&mut v); (r, v) }",
      expected: "(None, [])",
    },
    {
      label: "先頭と末尾に +1",
      expr: "{ let mut v = vec![1, 2, 3]; bump_both(&mut v); v }",
      expected: "[2, 2, 4]",
    },
    {
      label: "1 要素なら +2",
      expr: "{ let mut v = vec![10]; bump_both(&mut v); v }",
      expected: "[12]",
    },
    {
      label: "空でも panic しない",
      expr: "{ let mut v: Vec<i32> = vec![]; bump_both(&mut v); v }",
      expected: "[]",
    },
  ],
};

export default grader;
