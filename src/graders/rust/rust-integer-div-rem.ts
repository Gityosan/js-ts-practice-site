import type { RustGraderDef } from "../../grade/types";

const grader: RustGraderDef = {
  kind: "rust",
  mode: "harness",
  cases: [
    { label: "1 時間 2 分 5 秒", expr: "split_time(3725)", expected: "(1, 2, 5)" },
    { label: "1 分未満", expr: "split_time(59)", expected: "(0, 0, 59)" },
    { label: "0 秒", expr: "split_time(0)", expected: "(0, 0, 0)" },
    { label: "ちょうど 1 日", expr: "split_time(86400)", expected: "(24, 0, 0)" },
    { label: "正の位置を折り返す", expr: "wrap_index(7, 5)", expected: "2" },
    { label: "負の位置", expr: "wrap_index(-1, 5)", expected: "4" },
  ],
};

export default grader;
