import type { RustGraderDef } from "../../grade/types";

const grader: RustGraderDef = {
  kind: "rust",
  mode: "harness",
  cases: [
    {
      label: "重複を除いた数",
      expr: "unique_count(&[Pos { x: 0, y: 0 }, Pos { x: 1, y: 0 }, Pos { x: 0, y: 0 }])",
      expected: "2",
    },
    { label: "空", expr: "unique_count(&[])", expected: "0" },
    {
      label: "訪問回数",
      expr: "visit_counts(&[Pos { x: 0, y: 0 }, Pos { x: 1, y: 0 }, Pos { x: 0, y: 0 }])",
      expected: "[(Pos { x: 0, y: 0 }, 2), (Pos { x: 1, y: 0 }, 1)]",
    },
    {
      label: "ソート順（x → y）",
      expr: "visit_counts(&[Pos { x: 2, y: -1 }, Pos { x: -3, y: 5 }, Pos { x: 2, y: -2 }, Pos { x: 2, y: -1 }]).iter().map(|(p, n)| (p.x, p.y, *n)).collect::<Vec<_>>()",
      expected: "[(-3, 5, 1), (2, -2, 1), (2, -1, 2)]",
    },
  ],
};

export default grader;
