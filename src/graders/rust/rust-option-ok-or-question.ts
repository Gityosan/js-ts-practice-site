import type { RustGraderDef } from "../../grade/types";

const grader: RustGraderDef = {
  kind: "rust",
  mode: "harness",
  cases: [
    {
      label: "find_user（あり）",
      expr: 'find_user(&[(1, "amy"), (2, "bob")], 2)',
      expected: 'Ok("bob")',
    },
    {
      label: "find_user（なし）",
      expr: 'find_user(&[(1, "amy")], 9)',
      expected: 'Err("user 9 not found")',
    },
    {
      label: "greet 成功",
      expr: 'greet(&[(1, "amy"), (2, "bob")], "2")',
      expected: 'Ok("Hello, bob!")',
    },
    {
      label: "greet 数でない",
      expr: 'greet(&[(1, "amy")], "x")',
      expected: 'Err("invalid id: x")',
    },
    {
      label: "greet 見つからない",
      expr: 'greet(&[(1, "amy")], "9")',
      expected: 'Err("user 9 not found")',
    },
    {
      label: "first_number",
      expr: '(first_number(" 12 ,5"), first_number("a,1"), first_number(""))',
      expected: "(Some(12), None, None)",
    },
  ],
};

export default grader;
