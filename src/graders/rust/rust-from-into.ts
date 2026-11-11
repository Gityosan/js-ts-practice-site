import type { RustGraderDef } from "../../grade/types";

const grader: RustGraderDef = {
  kind: "rust",
  mode: "harness",
  cases: [
    { label: "Point::from", expr: "Point::from((1, 2))", expected: "Point { x: 1, y: 2 }" },
    {
      label: "into で Point",
      expr: "{ let p: Point = (-3, 4).into(); p }",
      expected: "Point { x: -3, y: 4 }",
    },
    {
      label: "沸点",
      expr: "{ let f: Fahrenheit = Celsius(100.0).into(); f }",
      expected: "Fahrenheit(212.0)",
    },
    { label: "氷点", expr: "Fahrenheit::from(Celsius(0.0))", expected: "Fahrenheit(32.0)" },
    {
      label: "label に &str と String",
      expr: 'vec![label("a"), label(String::from("b"))]',
      expected: '["[a]", "[b]"]',
    },
  ],
};

export default grader;
