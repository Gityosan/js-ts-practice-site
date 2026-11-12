import type { RustGraderDef } from "../../grade/types";

const grader: RustGraderDef = {
  kind: "rust",
  mode: "harness",
  cases: [
    { label: "3 × 4", expr: "area_and_perimeter((3, 4))", expected: "(12, 14)" },
    { label: "正方形", expr: "area_and_perimeter((5, 5))", expected: "(25, 20)" },
    { label: "幅 0", expr: "area_and_perimeter((0, 7))", expected: "(0, 14)" },
    { label: "1 × 1", expr: "area_and_perimeter((1, 1))", expected: "(1, 4)" },
  ],
};

export default grader;
