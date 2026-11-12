import type { RustGraderDef } from "../../grade/types";

const grader: RustGraderDef = {
  kind: "rust",
  mode: "harness",
  cases: [
    {
      label: "生きている間は記録なし",
      expr: '{ let log = new_log(); let _a = Noisy::new("a", &log); let n = log.borrow().len(); n }',
      expected: "0",
    },
    {
      label: "宣言と逆順に破棄",
      expr: '{ let log = new_log(); { let _a = Noisy::new("a", &log); let _b = Noisy::new("b", &log); let _c = Noisy::new("c", &log); } let v = log.borrow().clone(); v }',
      expected: '["drop c", "drop b", "drop a"]',
    },
    {
      label: "drop で早めに破棄",
      expr: '{ let log = new_log(); { let a = Noisy::new("a", &log); let _b = Noisy::new("b", &log); drop(a); log.borrow_mut().push("mid".to_string()); } let v = log.borrow().clone(); v }',
      expected: '["drop a", "mid", "drop b"]',
    },
    {
      label: "Vec の要素は先頭から",
      expr: '{ let log = new_log(); { let _v = vec![Noisy::new("x", &log), Noisy::new("y", &log)]; } let v = log.borrow().clone(); v }',
      expected: '["drop x", "drop y"]',
    },
    {
      label: "ムーブ先で破棄",
      expr: '{ let log = new_log(); let keep; { let a = Noisy::new("a", &log); let _b = Noisy::new("b", &log); keep = a; } log.borrow_mut().push("inner end".to_string()); drop(keep); let v = log.borrow().clone(); v }',
      expected: '["drop b", "inner end", "drop a"]',
    },
  ],
};

export default grader;
