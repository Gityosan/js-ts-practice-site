import type { RustGraderDef } from "../../grade/types";

const grader: RustGraderDef = {
  kind: "rust",
  mode: "harness",
  cases: [
    {
      label: "リストを作る",
      expr: "from_slice(&[1, 2, 3])",
      expected: "Cons(1, Cons(2, Cons(3, Nil)))",
    },
    { label: "空のリスト", expr: "from_slice(&[])", expected: "Nil" },
    { label: "長さ", expr: "len(&from_slice(&[4, 5, 6, 7]))", expected: "4" },
    { label: "空の長さは 0", expr: "len(&Nil)", expected: "0" },
    { label: "合計", expr: "sum(&from_slice(&[10, -3, 5]))", expected: "12" },
    {
      label: "手で組んだリストの合計",
      expr: "sum(&Cons(1, Box::new(Cons(2, Box::new(Nil)))))",
      expected: "3",
    },
  ],
};

export default grader;
