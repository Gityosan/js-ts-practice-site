import type { RustGraderDef } from "../../grade/types";

const grader: RustGraderDef = {
  kind: "rust",
  mode: "harness",
  cases: [
    { label: "square!(4)", expr: "square!(4)", expected: "16" },
    { label: "square!(1 + 2) は 9", expr: "square!(1 + 2)", expected: "9" },
    {
      label: "式は 1 回だけ評価",
      expr: "{ let mut n = 0; let r = square!({ n += 1; n + 2 }); (r, n) }",
      expected: "(9, 1)",
    },
    { label: "greet!()", expr: "greet!()", expected: '"Hello, world!"' },
    { label: "greet!(名前)", expr: 'greet!("Rust")', expected: '"Hello, Rust!"' },
  ],
};

export default grader;
