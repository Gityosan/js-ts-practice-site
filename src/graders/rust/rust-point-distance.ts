import type { RustGraderDef } from "../../grade/types";

const grader: RustGraderDef = {
  kind: "rust",
  mode: "harness",
  cases: [
    { label: "new で作れる", expr: "Point::new(1.5, -2.0)", expected: "Point { x: 1.5, y: -2.0 }" },
    { label: "origin は原点", expr: "Point::origin()", expected: "Point { x: 0.0, y: 0.0 }" },
    {
      label: "3-4-5 の距離",
      expr: "Point::new(3.0, 4.0).distance(&Point::origin())",
      expected: "5.0",
    },
    {
      label: "同じ点の距離は 0",
      expr: "Point::new(2.0, 2.0).distance(&Point::new(2.0, 2.0))",
      expected: "0.0",
    },
    {
      label: "translate で移動",
      expr: "{ let mut p = Point::new(3.0, 4.0); p.translate(1.0, -1.0); p }",
      expected: "Point { x: 4.0, y: 3.0 }",
    },
  ],
};

export default grader;
