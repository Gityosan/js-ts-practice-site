import type { RustGraderDef } from "../../grade/types";

const grader: RustGraderDef = {
  kind: "rust",
  mode: "harness",
  cases: [
    {
      label: "add_opt",
      expr: "(add_opt(Some(2), Some(3)), add_opt(Some(2), None), add_opt(None, None))",
      expected: "(Some(5), None, None)",
    },
    {
      label: "even_only",
      expr: "(even_only(Some(4)), even_only(Some(3)), even_only(None))",
      expected: "(Some(4), None, None)",
    },
    {
      label: "pick_name",
      expr: '(pick_name(Some("Fe"), Some("Ferris")), pick_name(None, Some("Ann")), pick_name(None, None))',
      expected: '("Fe", "Ann", "anonymous")',
    },
    {
      label: "is_adult",
      expr: "(is_adult(Some(25)), is_adult(Some(20)), is_adult(Some(19)), is_adult(None))",
      expected: "(true, true, false, false)",
    },
    {
      label: "title_len（所有権は残る）",
      expr: '{ let t = Some(String::from("Rust")); let n = title_len(&t); (n, t, title_len(&None)) }',
      expected: '(4, Some("Rust"), 0)',
    },
  ],
};

export default grader;
