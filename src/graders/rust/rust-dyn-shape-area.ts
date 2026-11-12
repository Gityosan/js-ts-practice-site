import type { RustGraderDef } from "../../grade/types";

const grader: RustGraderDef = {
  kind: "rust",
  mode: "harness",
  cases: [
    {
      label: "長方形と三角形",
      expr: "total_area(&[Box::new(Rect { w: 2.0, h: 3.0 }) as Box<dyn Shape>, Box::new(Triangle { base: 4.0, height: 5.0 })])",
      expected: "16.0",
    },
    {
      label: "円を含む（小数 2 桁）",
      expr: 'format!("{:.2}", total_area(&[Box::new(Circle { r: 1.0 }) as Box<dyn Shape>, Box::new(Rect { w: 1.0, h: 1.0 })]))',
      expected: '"4.14"',
    },
    { label: "空なら 0", expr: "total_area(&[]) == 0.0", expected: "true" },
    {
      label: "最大の図形",
      expr: "largest(&[Box::new(Rect { w: 2.0, h: 3.0 }) as Box<dyn Shape>, Box::new(Circle { r: 2.0 }), Box::new(Triangle { base: 4.0, height: 5.0 })])",
      expected: 'Some("circle")',
    },
    { label: "空なら None", expr: "largest(&[])", expected: "None" },
  ],
};

export default grader;
