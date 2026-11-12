import type { RustGraderDef } from "../../grade/types";

const grader: RustGraderDef = {
  kind: "rust",
  mode: "harness",
  cases: [
    { label: "Vec のメソッドで読む", expr: "Tracked::new(vec![4, 5, 6]).len()", expected: "3" },
    {
      label: "push できる",
      expr: "{ let mut t = Tracked::new(vec![1, 2]); t.push(3); t.inner.clone() }",
      expected: "[1, 2, 3]",
    },
    {
      label: "&mut の回数を数える",
      expr: "{ let mut t = Tracked::new(vec![1, 2]); t.push(3); let _ = t.len(); t[0] = 10; t.mut_count() }",
      expected: "2",
    },
    {
      label: "読むだけなら 0 回",
      expr: "{ let t = Tracked::new(vec![1, 2]); let _ = t.first(); let _ = t.contains(&2); t.mut_count() }",
      expected: "0",
    },
    {
      label: "&[i32] に型強制",
      expr: "{ let mut t = Tracked::new(vec![1, 2]); t.push(3); t[0] = 10; sum(&t) }",
      expected: "15",
    },
  ],
};

export default grader;
