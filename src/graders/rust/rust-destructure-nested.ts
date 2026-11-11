import type { RustGraderDef } from "../../grade/types";

const grader: RustGraderDef = {
  kind: "rust",
  mode: "harness",
  cases: [
    {
      label: "原点の円",
      expr: "describe(&Shape::Circle { center: Point { x: 0, y: 0 }, r: 5 })",
      expected: '"原点の円 r=5"',
    },
    {
      label: "普通の円",
      expr: "describe(&Shape::Circle { center: Point { x: 1, y: 2 }, r: 3 })",
      expected: '"円 (1,2) r=3"',
    },
    {
      label: "水平線（逆向き）",
      expr: "describe(&Shape::Line(Point { x: 5, y: 1 }, Point { x: 1, y: 1 }))",
      expected: '"水平線 長さ=4"',
    },
    {
      label: "斜めの線",
      expr: "describe(&Shape::Line(Point { x: 0, y: 0 }, Point { x: 3, y: 4 }))",
      expected: '"線 (0,0)-(3,4)"',
    },
    {
      label: "組の合計",
      expr: "(sum_pairs(&[(1, 2), (3, 4), (-1, 0)]), sum_pairs(&[]))",
      expected: "((3, 6), (0, 0))",
    },
    {
      label: "x と y を入れ替え",
      expr: "swap_xy(Point { x: 7, y: -2 })",
      expected: "Point { x: -2, y: 7 }",
    },
  ],
};

export default grader;
