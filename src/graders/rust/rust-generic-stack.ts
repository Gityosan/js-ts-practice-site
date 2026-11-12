import type { RustGraderDef } from "../../grade/types";

const grader: RustGraderDef = {
  kind: "rust",
  mode: "harness",
  cases: [
    {
      label: "push して pop",
      expr: "{ let mut s = Stack::new(); s.push(1); s.push(2); (s.pop(), s.len()) }",
      expected: "(Some(2), 1)",
    },
    {
      label: "peek は取り出さない",
      expr: '{ let mut s = Stack::new(); s.push("a"); s.push("b"); let top = s.peek().copied(); (top, s.len()) }',
      expected: '(Some("b"), 2)',
    },
    {
      label: "空の pop は None",
      expr: "{ let mut s: Stack<i32> = Stack::new(); (s.pop(), s.is_empty()) }",
      expected: "(None, true)",
    },
    {
      label: "String も積める",
      expr: '{ let mut s = Stack::new(); s.push(String::from("x")); s.push(String::from("y")); let a = s.pop(); let b = s.pop(); let c = s.pop(); (a, b, c) }',
      expected: '(Some("y"), Some("x"), None)',
    },
  ],
};

export default grader;
