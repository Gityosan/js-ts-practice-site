import type { RustGraderDef } from "../../grade/types";

const grader: RustGraderDef = {
  kind: "rust",
  mode: "harness",
  cases: [
    { label: "割り切れる平均", expr: "average3(1, 2, 3)", expected: "2.0" },
    { label: "割り切れない平均", expr: "average3(1, 2, 4)", expected: "2.3333333333333335" },
    { label: "負の数を含む平均", expr: "average3(-3, 0, 1)", expected: "-0.6666666666666666" },
    { label: "パーセントは切り捨て", expr: "to_percent(0.756)", expected: "75" },
    { label: "100%", expr: "to_percent(1.0)", expected: "100" },
    {
      label: "下位 8 ビット",
      expr: "(low_byte(300), low_byte(255), low_byte(256))",
      expected: "(44, 255, 0)",
    },
  ],
};

export default grader;
