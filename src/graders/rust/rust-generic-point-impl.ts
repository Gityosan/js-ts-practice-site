import type { RustGraderDef } from "../../grade/types";

const grader: RustGraderDef = {
  kind: "rust",
  mode: "harness",
  cases: [
    { label: "new（i32）", expr: "Point::new(1, 2)", expected: "Point { x: 1, y: 2 }" },
    { label: "swap（i32）", expr: "Point::new(1, 2).swap()", expected: "Point { x: 2, y: 1 }" },
    {
      label: "swap（String）",
      expr: 'Point::new(String::from("a"), String::from("b")).swap()',
      expected: 'Point { x: "b", y: "a" }',
    },
    { label: "距離 3-4-5", expr: "Point::new(3.0, 4.0).distance_from_origin()", expected: "5.0" },
    { label: "原点", expr: "Point::new(0.0, 0.0).distance_from_origin()", expected: "0.0" },
  ],
};

export default grader;
