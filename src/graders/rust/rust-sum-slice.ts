import type { RustGraderDef } from "../../grade/types";

const grader: RustGraderDef = {
  kind: "rust",
  mode: "harness",
  cases: [
    { label: "配列の参照", expr: "sum(&[1, 2, 3])", expected: "6" },
    { label: "Vec の参照", expr: "sum(&vec![10, 20])", expected: "30" },
    { label: "一部だけ", expr: "sum(&[1, 2, 3, 4, 5][1..4])", expected: "9" },
    { label: "空のスライス", expr: "sum(&[])", expected: "0" },
    { label: "正の数を数える", expr: "count_positive(&[-1, 0, 2, 5])", expected: "2" },
    { label: "空は 0 個", expr: "count_positive(&[])", expected: "0" },
  ],
};

export default grader;
