import type { RustGraderDef } from "../../grade/types";

const grader: RustGraderDef = {
  kind: "rust",
  mode: "harness",
  cases: [
    { label: "ASCII", expr: 'with_char_count(String::from("hello"))', expected: '("hello", 5)' },
    {
      label: "日本語は文字数",
      expr: 'with_char_count(String::from("日本語"))',
      expected: '("日本語", 3)',
    },
    { label: "空文字", expr: "with_char_count(String::new())", expected: '("", 0)' },
    {
      label: "返ってきた String を使い続けられる",
      expr: '{ let s = String::from("ab"); let (s, n) = with_char_count(s); format!("{s}{n}") }',
      expected: '"ab2"',
    },
  ],
};

export default grader;
