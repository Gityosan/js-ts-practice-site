import type { RustGraderDef } from "../../grade/types";

const grader: RustGraderDef = {
  kind: "rust",
  mode: "harness",
  cases: [
    {
      label: "参照カウントは n",
      expr: "{ let hs = share(vec![1, 2, 3], 3); Rc::strong_count(&hs[0]) }",
      expected: "3",
    },
    {
      label: "同じ実体を指す",
      expr: "{ let hs = share(vec![1, 2, 3], 3); Rc::ptr_eq(&hs[0], &hs[2]) }",
      expected: "true",
    },
    {
      label: "1 つ捨てるとカウントが減る",
      expr: "{ let mut hs = share(vec![7], 4); hs.pop(); Rc::strong_count(&hs[0]) }",
      expected: "3",
    },
    { label: "合計", expr: "total(&share(vec![1, 2, 3], 3))", expected: "18" },
    { label: "n = 0", expr: "share(vec![1], 0).len()", expected: "0" },
  ],
};

export default grader;
