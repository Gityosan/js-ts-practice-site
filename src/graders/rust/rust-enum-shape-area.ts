import type { RustGraderDef } from "../../grade/types";

const grader: RustGraderDef = {
  kind: "rust",
  mode: "harness",
  cases: [
    {
      label: "長方形の面積",
      expr: "Shape::Rectangle { width: 3.0, height: 4.0 }.area()",
      expected: "12.0",
    },
    {
      label: "円の面積（小数 2 桁）",
      expr: 'format!("{:.2}", Shape::Circle { radius: 2.0 }.area())',
      expected: '"12.57"',
    },
    { label: "直角三角形の面積", expr: "Shape::Triangle(3.0, 4.0, 5.0).area()", expected: "6.0" },
    {
      label: "長方形の周",
      expr: "Shape::Rectangle { width: 3.0, height: 4.0 }.perimeter()",
      expected: "14.0",
    },
    {
      label: "円の周（小数 3 桁）",
      expr: 'format!("{:.3}", Shape::Circle { radius: 1.0 }.perimeter())',
      expected: '"6.283"',
    },
    { label: "三角形の周", expr: "Shape::Triangle(3.0, 4.0, 5.0).perimeter()", expected: "12.0" },
  ],
};

export default grader;
