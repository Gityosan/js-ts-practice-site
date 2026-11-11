import type { RustGraderDef } from "../../grade/types";

const grader: RustGraderDef = {
  kind: "rust",
  mode: "harness",
  cases: [
    { label: "右からスカラー倍", expr: "v(1, 2) * 3", expected: "Vec2 { x: 3, y: 6 }" },
    { label: "左からスカラー倍", expr: "-2 * v(1, 2)", expected: "Vec2 { x: -2, y: -4 }" },
    { label: "内積", expr: "v(1, 2) * v(3, 4)", expected: "11" },
    { label: "直交するベクトルの内積は 0", expr: "v(2, 0) * v(0, 5)", expected: "0" },
    {
      label: "+= と -=",
      expr: "{ let mut a = v(1, 1); a += v(2, 3); a += v(1, 1); a -= v(0, 2); a }",
      expected: "Vec2 { x: 4, y: 3 }",
    },
  ],
};

export default grader;
