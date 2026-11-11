import type { RustGraderDef } from "../../grade/types";

const grader: RustGraderDef = {
  kind: "rust",
  mode: "harness",
  cases: [
    { label: "new は 0 から", expr: "Counter::new(5).value()", expected: "0" },
    {
      label: "3 回増やす",
      expr: "{ let mut c = Counter::new(5); c.increment(); c.increment(); c.increment(); c.value() }",
      expected: "3",
    },
    {
      label: "上限で止まる",
      expr: "{ let mut c = Counter::new(2); let r: Vec<bool> = (0..4).map(|_| c.increment()).collect(); (r, c.value()) }",
      expected: "([true, true, false, false], 2)",
    },
    {
      label: "上限 0 は増えない",
      expr: "{ let mut c = Counter::new(0); (c.increment(), c.value()) }",
      expected: "(false, 0)",
    },
    {
      label: "reset で 0 に戻る",
      expr: "{ let mut c = Counter::new(3); c.increment(); c.increment(); c.reset(); (c.value(), c.increment()) }",
      expected: "(0, true)",
    },
  ],
};

export default grader;
