import type { RustGraderDef } from "../../grade/types";

const grader: RustGraderDef = {
  kind: "rust",
  mode: "harness",
  cases: [
    {
      label: "最初の 10 個",
      expr: "Fibonacci::new().take(10).collect::<Vec<_>>()",
      expected: "[0, 1, 1, 2, 3, 5, 8, 13, 21, 34]",
    },
    {
      label: "50 番目（0 始まり）",
      expr: "Fibonacci::new().nth(50)",
      expected: "Some(12586269025)",
    },
    { label: "20 未満", expr: "fib_under(20)", expected: "[0, 1, 1, 2, 3, 5, 8, 13]" },
    { label: "1 未満", expr: "fib_under(1)", expected: "[0]" },
    {
      label: "偶数の和",
      expr: "(even_fib_sum(100), even_fib_sum(4000000))",
      expected: "(44, 4613732)",
    },
  ],
};

export default grader;
