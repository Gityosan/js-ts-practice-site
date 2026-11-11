import type { RustGraderDef } from "../../grade/types";

const grader: RustGraderDef = {
  kind: "rust",
  mode: "harness",
  cases: [
    {
      label: "黒を反転すると白",
      expr: "Color(0, 0, 0).invert()",
      expected: "Color(255, 255, 255)",
    },
    { label: "反転", expr: "Color(255, 128, 10).invert()", expected: "Color(0, 127, 245)" },
    { label: "16 進表記", expr: "Color(255, 128, 0).to_hex()", expected: '"#ff8000"' },
    { label: "1 桁も 0 埋め", expr: "Color(1, 2, 3).to_hex()", expected: '"#010203"' },
    {
      label: "距離の合計",
      expr: "total(&[Meters(1.5), Meters(2.0), Meters(0.5)])",
      expected: "Meters(4.0)",
    },
    { label: "空なら 0", expr: "total(&[])", expected: "Meters(0.0)" },
  ],
};

export default grader;
