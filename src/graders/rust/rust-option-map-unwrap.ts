import type { RustGraderDef } from "../../grade/types";

const grader: RustGraderDef = {
  kind: "rust",
  mode: "harness",
  cases: [
    {
      label: "name_length",
      expr: '(name_length(Some("Ann")), name_length(Some("フェリス")), name_length(None))',
      expected: "(3, 4, 0)",
    },
    {
      label: "upper_or_empty",
      expr: '(upper_or_empty(Some("hi".to_string())), upper_or_empty(None))',
      expected: '("HI", "")',
    },
    {
      label: "first_char_upper",
      expr: '(first_char_upper("rust"), first_char_upper("Go"), first_char_upper(""))',
      expected: "(Some('R'), Some('G'), None)",
    },
    {
      label: "double_or_else",
      expr: "(double_or_else(Some(4), 3), double_or_else(None, 3))",
      expected: "(8, 30)",
    },
  ],
};

export default grader;
