import type { RustGraderDef } from "../../grade/types";

const grader: RustGraderDef = {
  kind: "rust",
  mode: "harness",
  cases: [
    { label: "Point の Display", expr: "Point { x: 1, y: 2 }.to_string()", expected: '"(1, 2)"' },
    {
      label: "Point の枠",
      expr: "Point { x: 1, y: 2 }.outline().lines().map(String::from).collect::<Vec<_>>()",
      expected: '["**********", "* (1, 2) *", "**********"]',
    },
    {
      label: "負の座標",
      expr: "Point { x: -10, y: 0 }.outline().lines().map(String::from).collect::<Vec<_>>()",
      expected: '["************", "* (-10, 0) *", "************"]',
    },
    {
      label: "Tag の枠",
      expr: 'Tag("b".to_string()).outline()',
      expected: '"*******\\n* <b> *\\n*******"',
    },
  ],
};

export default grader;
