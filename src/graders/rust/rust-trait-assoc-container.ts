import type { RustGraderDef } from "../../grade/types";

const grader: RustGraderDef = {
  kind: "rust",
  mode: "harness",
  cases: [
    {
      label: "Stack の get / first",
      expr: "{ let s = Stack { items: vec![10, 20, 30] }; (s.get(1).copied(), s.first().copied(), s.get(5).copied()) }",
      expected: "(Some(20), Some(10), None)",
    },
    {
      label: "Stack の最後",
      expr: "last_item(&Stack { items: vec![10, 20, 30] }).copied()",
      expected: "Some(30)",
    },
    {
      label: "Letters（日本語も 1 文字ずつ）",
      expr: '{ let l = Letters::new("あいう"); (l.len(), l.first().copied(), last_item(&l).copied()) }',
      expected: "(3, Some('あ'), Some('う'))",
    },
    {
      label: "String の Stack",
      expr: 'last_item(&Stack { items: vec![String::from("x"), String::from("y")] }).cloned()',
      expected: 'Some("y")',
    },
    {
      label: "空なら None",
      expr: "last_item(&Stack::<i32> { items: vec![] }).copied()",
      expected: "None",
    },
  ],
};

export default grader;
