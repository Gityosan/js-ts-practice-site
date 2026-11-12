import type { RustGraderDef } from "../../grade/types";

const grader: RustGraderDef = {
  kind: "rust",
  mode: "harness",
  cases: [
    { label: "沸点 212°F", expr: "f_to_c(212.0)", expected: "100.0" },
    { label: "氷点 32°F", expr: "f_to_c(32.0)", expected: "0.0" },
    { label: "-40 は同じ値", expr: "f_to_c(-40.0)", expected: "-40.0" },
    { label: "50°F", expr: "f_to_c(50.0)", expected: "10.0" },
    { label: "割り切れない値", expr: "f_to_c(0.0)", expected: "-17.77777777777778" },
  ],
};

export default grader;
