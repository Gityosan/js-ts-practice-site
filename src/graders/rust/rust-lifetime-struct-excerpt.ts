import type { RustGraderDef } from "../../grade/types";

const grader: RustGraderDef = {
  kind: "rust",
  mode: "harness",
  cases: [
    {
      label: "最初の文",
      expr: 'first_sentence("Call me Ishmael. Some years ago...")',
      expected: 'Excerpt { part: "Call me Ishmael" }',
    },
    {
      label: "len",
      expr: 'first_sentence("Call me Ishmael. Some years ago...").len()',
      expected: "15",
    },
    {
      label: "ピリオドなし",
      expr: 'first_sentence("no period here").text()',
      expected: '"no period here"',
    },
    { label: "先頭がピリオド", expr: 'first_sentence(".abc").len()', expected: "0" },
    {
      label: "Excerpt を捨てても使える",
      expr: '{ let novel = String::from("A. B. C."); let t = { let e = first_sentence(&novel); e.text() }; t.to_string() }',
      expected: '"A"',
    },
  ],
};

export default grader;
