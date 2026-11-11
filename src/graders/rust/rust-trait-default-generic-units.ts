import type { RustGraderDef } from "../../grade/types";

const grader: RustGraderDef = {
  kind: "rust",
  mode: "harness",
  cases: [
    { label: "Mm + Mm", expr: "Mm(300) + Mm(200)", expected: "Mm(500)" },
    { label: "Mm + M", expr: "Mm(500) + M(2)", expected: "Mm(2500)" },
    { label: "M + Mm", expr: "M(1) + Mm(5)", expected: "Mm(1005)" },
    { label: "合計", expr: "total_mm(&[Mm(1), Mm(20), Mm(300)])", expected: "Mm(321)" },
    { label: "空の合計", expr: "total_mm(&[])", expected: "Mm(0)" },
  ],
};

export default grader;
