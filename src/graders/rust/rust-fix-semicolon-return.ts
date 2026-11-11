import type { RustGraderDef } from "../../grade/types";

const grader: RustGraderDef = {
  kind: "rust",
  mode: "harness",
  cases: [
    { label: "0°C", expr: "celsius_to_kelvin(0)", expected: "273" },
    { label: "負の温度", expr: "celsius_to_kelvin(-273)", expected: "0" },
    { label: "2 倍して 1 足す", expr: "double_then_inc(5)", expected: "11" },
    { label: "負の数", expr: "double_then_inc(-3)", expected: "-5" },
  ],
};

export default grader;
