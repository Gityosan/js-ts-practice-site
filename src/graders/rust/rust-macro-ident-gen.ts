import type { RustGraderDef } from "../../grade/types";

const grader: RustGraderDef = {
  kind: "rust",
  mode: "harness",
  cases: [
    { label: "double", expr: "double(21)", expected: "42" },
    { label: "triple", expr: "triple(-3)", expected: "-9" },
    { label: "negate", expr: "negate(7)", expected: "-7" },
    {
      label: "ゲッター x と y",
      expr: "{ let p = Point { x: 3, y: 4 }; (p.x(), p.y()) }",
      expected: "(3, 4)",
    },
  ],
};

export default grader;
