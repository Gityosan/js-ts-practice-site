import type { RustGraderDef } from "../../grade/types";

const grader: RustGraderDef = {
  kind: "rust",
  mode: "harness",
  cases: [
    {
      label: "all / any",
      expr: '{ let v = [("amy", 80), ("bob", 45), ("cid", 100)]; (all_passed(&v), any_perfect(&v), all_passed(&[])) }',
      expected: "(false, true, true)",
    },
    {
      label: "find",
      expr: '{ let v = [("amy", 80), ("bob", 45), ("dan", 10)]; (first_failed(&v), first_failed(&[("x", 60)])) }',
      expected: '(Some("bob"), None)',
    },
    {
      label: "position",
      expr: '{ let v = [("amy", 80), ("bob", 45)]; (position_of(&v, "bob"), position_of(&v, "zed")) }',
      expected: "(Some(1), None)",
    },
    {
      label: "min / max",
      expr: '{ let v = [("amy", 80), ("bob", 45), ("cid", 100)]; (score_range(&v), score_range(&[])) }',
      expected: "(Some((45, 100)), None)",
    },
    {
      label: "iter_mut",
      expr: '{ let mut v = vec![("amy", 80), ("bob", 45), ("cid", 95)]; add_bonus(&mut v, 10); v }',
      expected: '[("amy", 90), ("bob", 55), ("cid", 100)]',
    },
  ],
};

export default grader;
