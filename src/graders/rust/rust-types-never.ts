import type { RustGraderDef } from "../../grade/types";

const grader: RustGraderDef = {
  kind: "rust",
  mode: "harness",
  cases: [
    { label: "割り算", expr: "checked_div(7, 2)", expected: "3" },
    {
      label: "0 で割ると fail のメッセージで panic",
      expr: "{ let e = std::panic::catch_unwind(|| checked_div(1, 0)).unwrap_err(); e.downcast_ref::<String>().cloned() }",
      expected: 'Some("division by zero")',
    },
    {
      label: "読める数だけ合計",
      expr: 'sum_numbers(&["1", "x", "20", "-4", "3.5"])',
      expected: "17",
    },
    { label: "最初の偶数", expr: "first_even(&[3, 5, 8, 10])", expected: "8" },
    {
      label: "偶数がなければ panic",
      expr: "{ let e = std::panic::catch_unwind(|| first_even(&[1, 3])).unwrap_err(); e.downcast_ref::<String>().cloned() }",
      expected: 'Some("no even number")',
    },
  ],
};

export default grader;
