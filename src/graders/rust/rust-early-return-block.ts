import type { RustGraderDef } from "../../grade/types";

const grader: RustGraderDef = {
  kind: "rust",
  mode: "harness",
  cases: [
    { label: "普通の割り算", expr: "safe_div(10, 3)", expected: "3" },
    { label: "0 で割ろうとすると 0", expr: "safe_div(5, 0)", expected: "0" },
    { label: "負の数の割り算", expr: "safe_div(-9, 2)", expected: "-4" },
    { label: "重さ 0", expr: "shipping_fee(0)", expected: "500" },
    { label: "重さ 3", expr: "shipping_fee(3)", expected: "860" },
  ],
};

export default grader;
