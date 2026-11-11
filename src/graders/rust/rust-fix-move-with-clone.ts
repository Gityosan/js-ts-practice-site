import type { RustGraderDef } from "../../grade/types";

const grader: RustGraderDef = {
  kind: "rust",
  mode: "harness",
  cases: [
    { label: "hi を 2 つ", expr: 'duplicate(String::from("hi"))', expected: '("hi", "hi")' },
    {
      label: "日本語",
      expr: 'duplicate(String::from("所有権"))',
      expected: '("所有権", "所有権")',
    },
    { label: "空文字", expr: "duplicate(String::new())", expected: '("", "")' },
    {
      label: "2 つは独立した String",
      expr: "{ let (mut a, b) = duplicate(String::from(\"x\")); a.push('!'); (a, b) }",
      expected: '("x!", "x")',
    },
  ],
};

export default grader;
