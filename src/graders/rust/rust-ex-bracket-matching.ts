import type { RustGraderDef } from "../../grade/types";

const grader: RustGraderDef = {
  kind: "rust",
  mode: "harness",
  cases: [
    {
      label: "正しいコード",
      expr: 'check_brackets("fn main() { let v = [1, 2]; }")',
      expected: "Ok(())",
    },
    { label: "空文字", expr: 'check_brackets("")', expected: "Ok(())" },
    { label: "種類の違う閉じ括弧", expr: 'check_brackets("(]")', expected: "Err(1)" },
    { label: "開き括弧のない閉じ括弧", expr: 'check_brackets("a)b")', expected: "Err(1)" },
    {
      label: "閉じ忘れは最も前の開き括弧",
      expr: 'check_brackets("{ [ ( ) ]")',
      expected: "Err(0)",
    },
    {
      label: "日本語が混ざっても文字位置",
      expr: 'check_brackets("「あ」(い]")',
      expected: "Err(5)",
    },
  ],
};

export default grader;
