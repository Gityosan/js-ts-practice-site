import type { RustGraderDef } from "../../grade/types";

const grader: RustGraderDef = {
  kind: "rust",
  mode: "harness",
  cases: [
    {
      label: "step 3",
      expr: "Counter::new(1, 10, 3).collect::<Vec<_>>()",
      expected: "[1, 4, 7, 10]",
    },
    {
      label: "end を超えない",
      expr: "Counter::new(0, 10, 4).collect::<Vec<_>>()",
      expected: "[0, 4, 8]",
    },
    { label: "start > end", expr: "Counter::new(5, 3, 1).collect::<Vec<_>>()", expected: "[]" },
    { label: "sum が使える", expr: "Counter::new(1, 100, 1).sum::<u32>()", expected: "5050" },
    {
      label: "filter と count",
      expr: "Counter::new(1, 10, 1).filter(|x| x % 2 == 0).count()",
      expected: "5",
    },
    {
      label: "next を直接呼ぶ",
      expr: "{ let mut c = Counter::new(7, 7, 1); (c.next(), c.next(), c.next()) }",
      expected: "(Some(7), None, None)",
    },
  ],
};

export default grader;
