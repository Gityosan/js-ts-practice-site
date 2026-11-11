import type { RustGraderDef } from "../../grade/types";

const grader: RustGraderDef = {
  kind: "rust",
  mode: "harness",
  cases: [
    { label: "平均", expr: "average(&[1, 2, 3, 4])", expected: "2.5" },
    { label: "空の平均", expr: "average(&[])", expected: "0.0" },
    { label: "合格", expr: "label(80)", expected: '"合格"' },
    { label: "不合格", expr: "label(79)", expected: '"不合格"' },
    { label: "ミリ秒（u32 の範囲を超える）", expr: "total_ms(5_000_000)", expected: "5000000000" },
  ],
};

export default grader;
