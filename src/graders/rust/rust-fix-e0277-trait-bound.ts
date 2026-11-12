import type { RustGraderDef } from "../../grade/types";

const grader: RustGraderDef = {
  kind: "rust",
  mode: "harness",
  cases: [
    {
      label: "Debug 表示",
      expr: 'show(&Item { name: "pen".to_string(), price: 100 })',
      expected: '"Item { name: \\"pen\\", price: 100 }"',
    },
    {
      label: "安いほう",
      expr: 'cheaper(&Item { name: "a".to_string(), price: 300 }, &Item { name: "b".to_string(), price: 200 }).name',
      expected: '"b"',
    },
    {
      label: "== で比較",
      expr: 'same(&Item { name: "x".to_string(), price: 1 }, &Item { name: "x".to_string(), price: 1 })',
      expected: "true",
    },
    { label: "max_of 整数", expr: "max_of(&[3, 9, 2])", expected: "Some(9)" },
    {
      label: "max_of 文字列",
      expr: 'max_of(&["pear".to_string(), "apple".to_string()])',
      expected: 'Some("pear")',
    },
    { label: "max_of 空", expr: "max_of::<i32>(&[])", expected: "None" },
  ],
};

export default grader;
