import type { RustGraderDef } from "../../grade/types";

const grader: RustGraderDef = {
  kind: "rust",
  mode: "harness",
  cases: [
    {
      label: "2 単語読む",
      expr: '{ let mut p = Parser::new("  let x = 5"); (p.next_word(), p.next_word(), p.rest()) }',
      expected: '(Some("let"), Some("x"), " = 5")',
    },
    {
      label: "最後まで読む",
      expr: '{ let mut p = Parser::new("a bb  ccc "); let mut v = Vec::new(); while let Some(w) = p.next_word() { v.push(w); } v }',
      expected: '["a", "bb", "ccc"]',
    },
    {
      label: "空の入力",
      expr: '{ let mut p = Parser::new("   "); p.next_word() }',
      expected: "None",
    },
    {
      label: "読み終わったら None が続く",
      expr: '{ let mut p = Parser::new("x"); (p.next_word(), p.next_word(), p.next_word()) }',
      expected: '(Some("x"), None, None)',
    },
    {
      label: "結果は Parser より長生きできる",
      expr: '{ let text = String::from("hello world"); let w = { let mut p = Parser::new(&text); p.next_word() }; w.map(|s| s.to_string()) }',
      expected: 'Some("hello")',
    },
  ],
};

export default grader;
