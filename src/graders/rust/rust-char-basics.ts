import type { RustGraderDef } from "../../grade/types";

const grader: RustGraderDef = {
  kind: "rust",
  mode: "harness",
  cases: [
    { label: "ASCII のコードポイント", expr: "code_point('A')", expected: "65" },
    { label: "日本語のコードポイント", expr: "code_point('あ')", expected: "12354" },
    {
      label: "数字を文字に",
      expr: "(digit_char(0), digit_char(7), digit_char(9))",
      expected: "('0', '7', '9')",
    },
    {
      label: "母音",
      expr: "(is_vowel_or_digit('a'), is_vowel_or_digit('u'))",
      expected: "(true, true)",
    },
    { label: "数字", expr: "is_vowel_or_digit('5')", expected: "true" },
    {
      label: "子音・大文字・記号は false",
      expr: "(is_vowel_or_digit('z'), is_vowel_or_digit('A'), is_vowel_or_digit('!'))",
      expected: "(false, false, false)",
    },
  ],
};

export default grader;
