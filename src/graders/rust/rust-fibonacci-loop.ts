import type { RustGraderDef } from "../../grade/types";

const grader: RustGraderDef = {
  kind: "rust",
  mode: "harness",
  cases: [
    { label: "fib(0)", expr: "fib(0)", expected: "0" },
    { label: "fib(1) と fib(2)", expr: "(fib(1), fib(2))", expected: "(1, 1)" },
    { label: "fib(10)", expr: "fib(10)", expected: "55" },
    { label: "fib(50)", expr: "fib(50)", expected: "12586269025" },
    { label: "10 より大きい最初の数", expr: "first_fib_over(10)", expected: "13" },
    {
      label: "ちょうどフィボナッチ数の 89 より大きい",
      expr: "first_fib_over(89)",
      expected: "144",
    },
  ],
};

export default grader;
