import type { RustGraderDef } from "../../grade/types";

const grader: RustGraderDef = {
  kind: "rust",
  mode: "harness",
  cases: [
    {
      label: "invert",
      expr: "invert(Color { r: 255, g: 0, b: 100 })",
      expected: "Color { r: 0, g: 255, b: 155 }",
    },
    { label: "default は黒", expr: "Color::default()", expected: "Color { r: 0, g: 0, b: 0 }" },
    {
      label: "== で比較",
      expr: "Color { r: 1, g: 2, b: 3 } == Color { r: 1, g: 2, b: 3 }",
      expected: "true",
    },
    {
      label: "Copy なので代入後も使える",
      expr: "{ let a = Color { r: 9, g: 9, b: 9 }; let b = a; let c = invert(a); (a == b, c) }",
      expected: "(true, Color { r: 246, g: 246, b: 246 })",
    },
    {
      label: "2 回反転で元通り",
      expr: "{ let a = Color { r: 12, g: 34, b: 56 }; invert(invert(a)) == a }",
      expected: "true",
    },
  ],
};

export default grader;
