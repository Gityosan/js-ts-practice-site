import type { RustGraderDef } from "../../grade/types";

const grader: RustGraderDef = {
  kind: "rust",
  mode: "harness",
  cases: [
    { label: "面積 8×7", expr: "Rectangle { width: 8, height: 7 }.area()", expected: "56" },
    { label: "幅 0 なら面積 0", expr: "Rectangle { width: 0, height: 9 }.area()", expected: "0" },
    {
      label: "大きい方は小さい方を入れられる",
      expr: "Rectangle { width: 8, height: 7 }.can_hold(&Rectangle { width: 5, height: 1 })",
      expected: "true",
    },
    {
      label: "小さい方は入れられない",
      expr: "Rectangle { width: 5, height: 1 }.can_hold(&Rectangle { width: 8, height: 7 })",
      expected: "false",
    },
    {
      label: "同じ大きさは入らない",
      expr: "Rectangle { width: 3, height: 3 }.can_hold(&Rectangle { width: 3, height: 3 })",
      expected: "false",
    },
    {
      label: "片方だけ大きいのは入らない",
      expr: "Rectangle { width: 10, height: 2 }.can_hold(&Rectangle { width: 3, height: 5 })",
      expected: "false",
    },
  ],
};

export default grader;
