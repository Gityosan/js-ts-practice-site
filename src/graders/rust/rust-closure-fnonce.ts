import type { RustGraderDef } from "../../grade/types";

const grader: RustGraderDef = {
  kind: "rust",
  mode: "harness",
  cases: [
    { label: "run_with_log", expr: 'run_with_log(|| "ok".to_string())', expected: '"result: ok"' },
    {
      label: "make_taker を渡す",
      expr: 'run_with_log(make_taker("hi".to_string()))',
      expected: '"result: hi"',
    },
    {
      label: "make_taker を直接呼ぶ",
      expr: '{ let t = make_taker(String::from("abc")); t() }',
      expected: '"abc"',
    },
    {
      label: "Some なら中身",
      expr: 'or_compute(Some("v".to_string()), || "default".to_string())',
      expected: '"v"',
    },
    {
      label: "None なら f の結果",
      expr: 'or_compute(None, || "default".to_string())',
      expected: '"default"',
    },
    {
      label: "Some のとき f は呼ばれない",
      expr: '{ let mut called = false; let r = or_compute(Some("x".to_string()), || { called = true; String::new() }); (r, called) }',
      expected: '("x", false)',
    },
  ],
};

export default grader;
