import type { RustGraderDef } from "../../grade/types";

const grader: RustGraderDef = {
  kind: "rust",
  mode: "harness",
  cases: [
    { label: "割り切れない割り算", expr: "safe_div(10, 3)", expected: "Some(3)" },
    { label: "0 で割る", expr: "safe_div(1, 0)", expected: "None" },
    { label: "負の数", expr: "safe_div(-9, 3)", expected: "Some(-3)" },
    { label: "0 なら 0", expr: "(div_or_zero(1, 0), div_or_zero(8, 2))", expected: "(0, 4)" },
    { label: "describe Some", expr: "describe(safe_div(10, 2))", expected: '"結果: 5"' },
    { label: "describe None", expr: "describe(None)", expected: '"計算できません"' },
  ],
};

export default grader;
