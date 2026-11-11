import type { RustGraderDef } from "../../grade/types";

const grader: RustGraderDef = {
  kind: "rust",
  mode: "harness",
  cases: [
    {
      label: "parse_or",
      expr: '(parse_or("12", 0), parse_or("abc", 0), parse_or("-3", 9))',
      expected: "(12, 0, -3)",
    },
    {
      label: "require",
      expr: '(require(Some(3), "w"), require(None, "width"))',
      expected: '(Ok(3), Err("width がありません"))',
    },
    {
      label: "parse_positive",
      expr: '(parse_positive("5"), parse_positive("0"), parse_positive("-1"), parse_positive("x"))',
      expected: "(Some(5), None, None, None)",
    },
    {
      label: "合計",
      expr: "(checked_total(&[100, 250, 50]), checked_total(&[]))",
      expected: "(Some(400), Some(0))",
    },
    { label: "オーバーフロー", expr: "checked_total(&[u32::MAX, 1])", expected: "None" },
  ],
};

export default grader;
