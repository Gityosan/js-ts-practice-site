import type { RustGraderDef } from "../../grade/types";

const grader: RustGraderDef = {
  kind: "rust",
  mode: "harness",
  cases: [
    {
      label: "原点と軸上",
      expr: "[classify((0, 0)), classify((0, 5)), classify((-3, 0))]",
      expected: '["原点", "y軸上", "x軸上"]',
    },
    {
      label: "4 つの象限",
      expr: "[classify((1, 2)), classify((-1, 2)), classify((-2, -3)), classify((4, -1))]",
      expected: '["第1象限", "第2象限", "第3象限", "第4象限"]',
    },
    {
      label: "境界の点数",
      expr: "[grade(100), grade(90), grade(89), grade(70), grade(69), grade(50), grade(49), grade(0)]",
      expected: "['A', 'A', 'B', 'B', 'C', 'C', 'D', 'D']",
    },
    { label: "範囲外", expr: "grade(101)", expected: "'?'" },
  ],
};

export default grader;
