import type { RustGraderDef } from "../../grade/types";

const grader: RustGraderDef = {
  kind: "rust",
  mode: "harness",
  cases: [
    {
      label: "範囲内の値",
      expr: "(Percent::new(0).value(), Percent::new(42).value(), Percent::new(100).value())",
      expected: "(0, 42, 100)",
    },
    {
      label: "範囲外は panic（メッセージに値を含む）",
      expr: "{ let e = std::panic::catch_unwind(|| Percent::new(150)).unwrap_err(); e.downcast_ref::<String>().cloned() }",
      expected: 'Some("percent must be 0..=100, got 150")',
    },
    {
      label: "負の値も panic",
      expr: "std::panic::catch_unwind(|| Percent::new(-1)).is_err()",
      expected: "true",
    },
    { label: "平均（切り捨て）", expr: "average(&[70, 80, 95])", expected: "81" },
    {
      label: "空なら panic",
      expr: "{ let e = std::panic::catch_unwind(|| average(&[])).unwrap_err(); e.downcast_ref::<&str>().map(|s| s.to_string()).or_else(|| e.downcast_ref::<String>().cloned()) }",
      expected: 'Some("scores must not be empty")',
    },
  ],
};

export default grader;
