import type { RustGraderDef } from "../../grade/types";

const grader: RustGraderDef = {
  kind: "rust",
  mode: "harness",
  cases: [
    { label: "7 は素数", expr: "is_prime(7)", expected: "true" },
    { label: "9 は素数でない", expr: "is_prime(9)", expected: "false" },
    { label: "2 は素数", expr: "is_prime(2)", expected: "true" },
    {
      label: "0 と 1 は素数でない",
      expr: "(is_prime(0), is_prime(1))",
      expected: "(false, false)",
    },
    { label: "大きめの素数", expr: "is_prime(7919)", expected: "true" },
    { label: "平方数", expr: "is_prime(49)", expected: "false" },
  ],
};

export default grader;
