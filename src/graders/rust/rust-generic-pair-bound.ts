import type { RustGraderDef } from "../../grade/types";

const grader: RustGraderDef = {
  kind: "rust",
  mode: "harness",
  cases: [
    { label: "larger（i32）", expr: "Pair::new(3, 8).larger()", expected: "8" },
    { label: "larger（char）", expr: "Pair::new('q', 'c').larger()", expected: "'q'" },
    { label: "sorted（逆順）", expr: "Pair::new(9, 1).sorted()", expected: "(1, 9)" },
    { label: "sorted（f64）", expr: "Pair::new(-0.5, 2.5).sorted()", expected: "(-0.5, 2.5)" },
    {
      label: "Vec でも new は使える",
      expr: "{ let p = Pair::new(vec![1], vec![2, 3]); p.a.len() + p.b.len() }",
      expected: "3",
    },
  ],
};

export default grader;
