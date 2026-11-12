import type { RustGraderDef } from "../../grade/types";

const grader: RustGraderDef = {
  kind: "rust",
  mode: "harness",
  cases: [
    { label: "基本", expr: 'sum_csv("1, 2, 3")', expected: "6" },
    { label: "負の数と読めない要素", expr: 'sum_csv("10,-4, x, 5")', expected: "11" },
    { label: "空文字", expr: 'sum_csv("")', expected: "0" },
    { label: "前後の空白", expr: 'sum_csv(" 7 ")', expected: "7" },
    {
      label: "含む行を数える",
      expr: 'count_lines_with("apple pie\\nbanana\\npineapple", "apple")',
      expected: "2",
    },
    { label: "見つからない", expr: 'count_lines_with("a\\nb", "z")', expected: "0" },
  ],
};

export default grader;
