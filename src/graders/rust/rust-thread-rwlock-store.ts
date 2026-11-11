import type { RustGraderDef } from "../../grade/types";

const grader: RustGraderDef = {
  kind: "rust",
  mode: "harness",
  cases: [
    {
      label: "set と get",
      expr: '{ let s = Store::new(); s.set("lang", "ja"); s.get("lang") }',
      expected: 'Some("ja")',
    },
    { label: "無いキー", expr: '{ let s = Store::new(); s.get("x") }', expected: "None" },
    {
      label: "上書き",
      expr: '{ let s = Store::new(); s.set("a", "1"); s.set("a", "2"); (s.get("a"), s.len()) }',
      expected: '(Some("2"), 1)',
    },
    {
      label: "複数スレッドから書き込む",
      expr: '{ let s = Store::new(); std::thread::scope(|sc| { for i in 0..8 { let s = &s; sc.spawn(move || s.set(&format!("k{i}"), "v")); } }); s.len() }',
      expected: "8",
    },
    {
      label: "複数スレッドから読む",
      expr: '{ let s = Store::new(); s.set("x", "42"); let r: Vec<Option<String>> = std::thread::scope(|sc| { let hs: Vec<_> = (0..3).map(|_| sc.spawn(|| s.get("x"))).collect(); hs.into_iter().map(|h| h.join().unwrap()).collect() }); r }',
      expected: '[Some("42"), Some("42"), Some("42")]',
    },
  ],
};

export default grader;
