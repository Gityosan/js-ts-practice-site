import type { RustGraderDef } from "../../grade/types";

const grader: RustGraderDef = {
  kind: "rust",
  mode: "harness",
  cases: [
    {
      label: "1 つ目が長い",
      expr: 'longer(String::from("apple"), String::from("fig"))',
      expected: '"apple"',
    },
    {
      label: "2 つ目が長い",
      expr: 'longer(String::from("hi"), String::from("hey"))',
      expected: '"hey"',
    },
    {
      label: "同じ長さは 1 つ目",
      expr: 'longer(String::from("ab"), String::from("cd"))',
      expected: '"ab"',
    },
    {
      label: "バイト数ではなく文字数で比べる",
      expr: 'longer(String::from("abcd"), String::from("あいう"))',
      expected: '"abcd"',
    },
    { label: "空文字", expr: 'longer(String::new(), String::from("x"))', expected: '"x"' },
  ],
};

export default grader;
