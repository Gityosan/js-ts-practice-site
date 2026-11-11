import type { RustGraderDef } from "../../grade/types";

const grader: RustGraderDef = {
  kind: "rust",
  mode: "harness",
  cases: [
    { label: "get は値を返す", expr: 'Cache::new("hi".to_string()).get()', expected: '"hi"' },
    {
      label: "読まれた回数",
      expr: '{ let c = Cache::new("x".to_string()); c.get(); c.get(); c.get(); c.reads() }',
      expected: "3",
    },
    { label: "まだ読まれていない", expr: "Cache::new(String::new()).reads()", expected: "0" },
    {
      label: "借用できれば push",
      expr: "{ let cell = RefCell::new(vec![1]); let r = try_push(&cell, 2); (r, cell.borrow().clone()) }",
      expected: "(Ok(2), [1, 2])",
    },
    {
      label: "借用中なら Err",
      expr: "{ let cell = RefCell::new(vec![1]); let _g = cell.borrow(); try_push(&cell, 3) }",
      expected: 'Err("busy")',
    },
  ],
};

export default grader;
