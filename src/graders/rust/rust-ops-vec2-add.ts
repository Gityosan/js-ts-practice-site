import type { RustGraderDef } from "../../grade/types";

const grader: RustGraderDef = {
  kind: "rust",
  mode: "harness",
  cases: [
    { label: "足し算", expr: "v(1, 2) + v(3, 4)", expected: "Vec2 { x: 4, y: 6 }" },
    { label: "引き算", expr: "v(1, 2) - v(3, 4)", expected: "Vec2 { x: -2, y: -2 }" },
    { label: "符号反転", expr: "-v(1, -2)", expected: "Vec2 { x: -1, y: 2 }" },
    {
      label: "組み合わせ",
      expr: "{ let a = v(5, 5); let b = v(1, 2); a + b - -b }",
      expected: "Vec2 { x: 7, y: 9 }",
    },
    {
      label: "Copy なので元も使える",
      expr: "{ let a = v(1, 1); let _ = a + a; a == v(1, 1) }",
      expected: "true",
    },
  ],
};

export default grader;
