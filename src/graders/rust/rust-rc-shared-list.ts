import type { RustGraderDef } from "../../grade/types";

const grader: RustGraderDef = {
  kind: "rust",
  mode: "harness",
  cases: [
    { label: "1 要素", expr: "to_vec(&prepend(10, &Rc::new(Nil)))", expected: "[10]" },
    {
      label: "共有した末尾",
      expr: "{ let a = prepend(5, &prepend(10, &Rc::new(Nil))); let b = prepend(3, &a); let c = prepend(4, &a); (to_vec(&b), to_vec(&c)) }",
      expected: "([3, 5, 10], [4, 5, 10])",
    },
    {
      label: "末尾の参照カウント",
      expr: "{ let a = prepend(10, &Rc::new(Nil)); let _b = prepend(3, &a); let _c = prepend(4, &a); Rc::strong_count(&a) }",
      expected: "3",
    },
    {
      label: "片方を捨てるとカウントが減る",
      expr: "{ let a = prepend(10, &Rc::new(Nil)); let b = prepend(3, &a); drop(b); Rc::strong_count(&a) }",
      expected: "1",
    },
    { label: "空リスト", expr: "to_vec(&Nil)", expected: "[]" },
  ],
};

export default grader;
