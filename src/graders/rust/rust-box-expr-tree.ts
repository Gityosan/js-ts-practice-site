import type { RustGraderDef } from "../../grade/types";

const grader: RustGraderDef = {
  kind: "rust",
  mode: "harness",
  cases: [
    { label: "数だけ", expr: "eval(&num(42))", expected: "42" },
    { label: "(1 + 2) * 3", expr: "eval(&mul(add(num(1), num(2)), num(3)))", expected: "9" },
    { label: "符号反転", expr: "eval(&add(num(10), neg(mul(num(2), num(4)))))", expected: "2" },
    {
      label: "文字列にする",
      expr: "show(&mul(add(num(1), num(2)), num(3)))",
      expected: '"((1 + 2) * 3)"',
    },
    { label: "負の表示", expr: "show(&neg(num(4)))", expected: '"-4"' },
  ],
};

export default grader;
