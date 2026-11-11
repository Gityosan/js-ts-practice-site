import type { RustGraderDef } from "../../grade/types";

const grader: RustGraderDef = {
  kind: "rust",
  mode: "harness",
  cases: [
    { label: "プラグインなしはそのまま", expr: "Pipeline::new().run(42)", expected: "42" },
    {
      label: "順に適用",
      expr: "{ let mut p = Pipeline::new(); p.add(AddN(3)); p.add(MulN(2)); p.run(1) }",
      expected: "8",
    },
    {
      label: "順番が違えば結果も違う",
      expr: "{ let mut p = Pipeline::new(); p.add(MulN(2)); p.add(AddN(3)); p.run(1) }",
      expected: "5",
    },
    {
      label: "範囲に収める",
      expr: "{ let mut p = Pipeline::new(); p.add(AddN(3)); p.add(MulN(2)); p.add(Clamp { min: 0, max: 10 }); (p.run(9), p.run(-20)) }",
      expected: "(10, 0)",
    },
    {
      label: "名前の一覧",
      expr: "{ let mut p = Pipeline::new(); p.add(AddN(3)); p.add(MulN(-2)); p.add(Clamp { min: 0, max: 10 }); p.names() }",
      expected: '["add 3", "mul -2", "clamp 0..10"]',
    },
  ],
};

export default grader;
