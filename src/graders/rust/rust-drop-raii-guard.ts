import type { RustGraderDef } from "../../grade/types";

const grader: RustGraderDef = {
  kind: "rust",
  mode: "harness",
  cases: [
    {
      label: "作ると増える",
      expr: "{ let c = Rc::new(Cell::new(0)); let _g1 = ActiveGuard::new(&c); let _g2 = ActiveGuard::new(&c); c.get() }",
      expected: "2",
    },
    {
      label: "drop で減る",
      expr: "{ let c = Rc::new(Cell::new(0)); let g1 = ActiveGuard::new(&c); let _g2 = ActiveGuard::new(&c); drop(g1); c.get() }",
      expected: "1",
    },
    {
      label: "スコープを抜けると 0",
      expr: "{ let c = Rc::new(Cell::new(0)); { let _g = ActiveGuard::new(&c); let _h = ActiveGuard::new(&c); } c.get() }",
      expected: "0",
    },
    {
      label: "with_guards の途中の値",
      expr: "{ let c = Rc::new(Cell::new(0)); let _g = ActiveGuard::new(&c); with_guards(&c, 3) }",
      expected: "4",
    },
    {
      label: "with_guards の後は元通り",
      expr: "{ let c = Rc::new(Cell::new(0)); let _g = ActiveGuard::new(&c); with_guards(&c, 3); c.get() }",
      expected: "1",
    },
    {
      label: "panic しても解放される",
      expr: '{ let c = Rc::new(Cell::new(0)); let c2 = Rc::clone(&c); let _ = std::panic::catch_unwind(std::panic::AssertUnwindSafe(move || { let _g = ActiveGuard::new(&c2); panic!("boom"); })); c.get() }',
      expected: "0",
    },
  ],
};

export default grader;
