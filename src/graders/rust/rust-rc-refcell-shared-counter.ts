import type { RustGraderDef } from "../../grade/types";

const grader: RustGraderDef = {
  kind: "rust",
  mode: "harness",
  cases: [
    {
      label: "共有カウンタに足される",
      expr: '{ let c = Rc::new(RefCell::new(0)); let h = Rc::new(RefCell::new(Vec::new())); let a = Clicker::new("A", &c, &h); let b = Clicker::new("B", &c, &h); a.click(2); b.click(5); let v = *c.borrow(); v }',
      expected: "7",
    },
    {
      label: "どのボタンからも同じ値",
      expr: '{ let c = Rc::new(RefCell::new(10)); let h = Rc::new(RefCell::new(Vec::new())); let a = Clicker::new("A", &c, &h); let b = Clicker::new("B", &c, &h); a.click(-3); (a.current(), b.current()) }',
      expected: "(7, 7)",
    },
    {
      label: "履歴",
      expr: '{ let c = Rc::new(RefCell::new(0)); let h = Rc::new(RefCell::new(Vec::new())); let a = Clicker::new("A", &c, &h); let b = Clicker::new("B", &c, &h); a.click(2); b.click(5); a.click(1); let v = h.borrow().clone(); v }',
      expected: '["A+2", "B+5", "A+1"]',
    },
    {
      label: "参照カウント",
      expr: '{ let c = Rc::new(RefCell::new(0)); let h = Rc::new(RefCell::new(Vec::new())); let _a = Clicker::new("A", &c, &h); let _b = Clicker::new("B", &c, &h); Rc::strong_count(&c) }',
      expected: "3",
    },
  ],
};

export default grader;
