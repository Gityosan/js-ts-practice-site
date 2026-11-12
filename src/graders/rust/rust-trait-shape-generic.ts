import type { RustGraderDef } from "../../grade/types";

const grader: RustGraderDef = {
  kind: "rust",
  mode: "harness",
  cases: [
    { label: "Rect の面積", expr: "Rect { w: 2.0, h: 3.0 }.area()", expected: "6.0" },
    {
      label: "Triangle の面積",
      expr: "Triangle { base: 4.0, height: 3.0 }.area()",
      expected: "6.0",
    },
    {
      label: "Rect の合計",
      expr: "total_area(&[Rect { w: 2.0, h: 3.0 }, Rect { w: 1.0, h: 1.0 }])",
      expected: "7.0",
    },
    { label: "空の合計", expr: "total_area::<Triangle>(&[])", expected: "0.0" },
    {
      label: "Triangle が大きい",
      expr: "bigger_name(&Rect { w: 1.0, h: 1.0 }, &Triangle { base: 4.0, height: 2.0 })",
      expected: '"triangle"',
    },
    {
      label: "同じなら a",
      expr: "bigger_name(&Triangle { base: 2.0, height: 2.0 }, &Rect { w: 2.0, h: 1.0 })",
      expected: '"triangle"',
    },
  ],
};

export default grader;
