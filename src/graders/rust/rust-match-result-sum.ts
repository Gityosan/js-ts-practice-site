import type { RustGraderDef } from "../../grade/types";

const grader: RustGraderDef = {
  kind: "rust",
  mode: "harness",
  cases: [
    { label: "混在", expr: 'sum_and_errors(&["1", "2", "x", "40"])', expected: "(43, 1)" },
    { label: "空", expr: "sum_and_errors(&[])", expected: "(0, 0)" },
    { label: "全部失敗", expr: 'sum_and_errors(&["a", "", " 3"])', expected: "(0, 3)" },
    { label: "負の数も足す", expr: 'sum_and_errors(&["-5", "5", "-1"])', expected: "(-1, 0)" },
    {
      label: "label",
      expr: "[label(None), label(Some(0)), label(Some(7)), label(Some(-2))]",
      expected: '["なし", "ゼロ", "正", "負"]',
    },
  ],
};

export default grader;
