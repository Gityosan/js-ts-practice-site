import type { RustGraderDef } from "../../grade/types";

const grader: RustGraderDef = {
  kind: "rust",
  mode: "harness",
  cases: [
    { label: "str を Debug 表示", expr: 'debug_text("hi")', expected: '"\\"hi\\""' },
    { label: "スライスを Debug 表示", expr: "debug_text(&[1, 2][..])", expected: '"[1, 2]"' },
    { label: "str のバイト数", expr: 'byte_size("あいう")', expected: "9" },
    {
      label: "スライスのバイト数",
      expr: "(byte_size(&[0u16; 4][..]), byte_size(&5i64))",
      expected: "(8, 8)",
    },
    {
      label: "Labeled<str>",
      expr: '{ let l: Labeled<str> = Labeled { label: "name", value: Box::from("Ferris") }; l.describe() }',
      expected: '"name: \\"Ferris\\""',
    },
    {
      label: "Labeled<[i32]>",
      expr: '{ let l: Labeled<[i32]> = Labeled { label: "nums", value: vec![1, 2, 3].into_boxed_slice() }; l.describe() }',
      expected: '"nums: [1, 2, 3]"',
    },
  ],
};

export default grader;
