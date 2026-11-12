import type { RustGraderDef } from "../../grade/types";

const grader: RustGraderDef = {
  kind: "rust",
  mode: "harness",
  cases: [
    { label: "空白を取り除く", expr: 'parse_line("width = 80")', expected: 'Ok(("width", 80))' },
    { label: "= がない", expr: 'parse_line("width 80")', expected: "Err(MissingEquals)" },
    { label: "キーが空", expr: 'parse_line(" = 3")', expected: "Err(EmptyKey)" },
    { label: "数でない", expr: 'parse_line("x=abc")', expected: 'Err(BadNumber("abc"))' },
    {
      label: "全部読む",
      expr: 'parse_all(&["a=1", "b = -2"])',
      expected: 'Ok([("a", 1), ("b", -2)])',
    },
    {
      label: "最初のエラーで止まる",
      expr: 'parse_all(&["a=1", "b", "c=x"])',
      expected: "Err(MissingEquals)",
    },
  ],
};

export default grader;
