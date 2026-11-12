import type { RustGraderDef } from "../../grade/types";

const grader: RustGraderDef = {
  kind: "rust",
  mode: "harness",
  cases: [
    {
      label: "flush で取り出して空に",
      expr: '{ let mut b = Buffer { name: "log".into(), items: vec!["a".into(), "b".into()] }; let out = b.flush(); (out, b.items.len()) }',
      expected: '(["a", "b"], 0)',
    },
    {
      label: "rename は古い名前を返す",
      expr: '{ let mut b = Buffer { name: "old".into(), items: vec![] }; let old = b.rename("new"); (old, b.name) }',
      expected: '("old", "new")',
    },
    {
      label: "swap_with は items だけ入れ替える",
      expr: '{ let mut x = Buffer { name: "x".into(), items: vec!["1".into()] }; let mut y = Buffer { name: "y".into(), items: vec![] }; x.swap_with(&mut y); (x.name, x.items, y.name, y.items) }',
      expected: '("x", [], "y", ["1"])',
    },
    {
      label: "rotate3",
      expr: "{ let (mut a, mut b, mut c) = (1, 2, 3); rotate3(&mut a, &mut b, &mut c); (a, b, c) }",
      expected: "(2, 3, 1)",
    },
  ],
};

export default grader;
