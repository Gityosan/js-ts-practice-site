import type { RustGraderDef } from "../../grade/types";

const grader: RustGraderDef = {
  kind: "rust",
  mode: "harness",
  cases: [
    {
      label: "週末",
      expr: '(is_weekend("sat"), is_weekend("sun"), is_weekend("mon"))',
      expected: "(true, true, false)",
    },
    {
      label: "分類",
      expr: "(classify(5), classify(-3), classify(0))",
      expected: '("positive", "negative", "zero")',
    },
    { label: "percent", expr: "percent(1, 4)", expected: "25" },
    {
      label: "whole が 0 なら panic",
      expr: "std::panic::catch_unwind(|| percent(1, 0)).is_err()",
      expected: "true",
    },
    {
      label: "part > whole なら panic",
      expr: "std::panic::catch_unwind(|| percent(5, 4)).is_err()",
      expected: "true",
    },
  ],
};

export default grader;
