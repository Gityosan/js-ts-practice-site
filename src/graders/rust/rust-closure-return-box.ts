import type { RustGraderDef } from "../../grade/types";

const grader: RustGraderDef = {
  kind: "rust",
  mode: "harness",
  cases: [
    {
      label: "make_adder",
      expr: "{ let add5 = make_adder(5); (add5(1), add5(-5)) }",
      expected: "(6, 0)",
    },
    {
      label: "make_op の各演算",
      expr: "(make_op('+')(3, 4), make_op('-')(3, 4), make_op('*')(3, 4))",
      expected: "(7, -1, 12)",
    },
    { label: "未知の演算子", expr: "make_op('/')(8, 2)", expected: "0" },
    {
      label: "Vec に並べる",
      expr: "{ let ops = vec![make_op('+'), make_op('*')]; let mut v = Vec::new(); for f in &ops { v.push(f(5, 6)); } v }",
      expected: "[11, 30]",
    },
    {
      label: "compose",
      expr: "{ let h = compose(make_adder(1), |x| x * 10); h(2) }",
      expected: "30",
    },
  ],
};

export default grader;
