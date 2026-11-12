import type { RustGraderDef } from "../../grade/types";

const grader: RustGraderDef = {
  kind: "rust",
  mode: "harness",
  cases: [
    {
      label: "昇順なら panic しない",
      expr: "(std::panic::catch_unwind(|| assert_sorted(&[1, 2, 2, 5])).is_ok(), std::panic::catch_unwind(|| assert_sorted(&[])).is_ok())",
      expected: "(true, true)",
    },
    {
      label: "昇順でなければメッセージ付きで panic",
      expr: "{ let e = std::panic::catch_unwind(|| assert_sorted(&[1, 2, 5, 3])).unwrap_err(); e.downcast_ref::<String>().cloned() }",
      expected: 'Some("not sorted at index 2: 5 > 3")',
    },
    {
      label: "同じ要素なら OK",
      expr: "std::panic::catch_unwind(|| assert_same_elements(&[3, 1, 2], &[1, 2, 3])).is_ok()",
      expected: "true",
    },
    {
      label: "個数が違えば panic",
      expr: "(std::panic::catch_unwind(|| assert_same_elements(&[1, 1, 2], &[1, 2, 2])).is_err(), std::panic::catch_unwind(|| assert_same_elements(&[1], &[1, 1])).is_err())",
      expected: "(true, true)",
    },
    {
      label: "すべて異なるか",
      expr: "(std::panic::catch_unwind(|| assert_all_distinct(&[4, 1, 7])).is_ok(), std::panic::catch_unwind(|| assert_all_distinct(&[4, 1, 4])).is_err())",
      expected: "(true, true)",
    },
  ],
};

export default grader;
