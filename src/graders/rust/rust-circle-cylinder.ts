import type { RustGraderDef } from "../../grade/types";

const grader: RustGraderDef = {
  kind: "rust",
  mode: "harness",
  cases: [
    { label: "半径 1", expr: "circle_area(1.0)", expected: "3.141592653589793" },
    { label: "半径 0", expr: "circle_area(0.0)", expected: "0.0" },
    { label: "半径 2", expr: "circle_area(2.0)", expected: "12.566370614359172" },
    { label: "円柱 r=1, h=2", expr: "cylinder_volume(1.0, 2.0)", expected: "6.283185307179586" },
    { label: "高さ 0", expr: "cylinder_volume(3.0, 0.0)", expected: "0.0" },
  ],
};

export default grader;
