import type { RustGraderDef } from "../../grade/types";

const grader: RustGraderDef = {
  kind: "rust",
  mode: "harness",
  cases: [
    { label: "増加回数", expr: "count_increases(&[199, 200, 208, 210, 200, 207])", expected: "4" },
    { label: "1 要素", expr: "count_increases(&[5])", expected: "0" },
    { label: "区切りごとの合計", expr: "chunk_sums(&[1, 2, 3, 4, 5], 2)", expected: "[3, 7, 5]" },
    { label: "ちょうど割り切れる", expr: "chunk_sums(&[1, 1, 1, 1, 1, 1], 3)", expected: "[3, 3]" },
    {
      label: "昇順",
      expr: "(is_sorted_asc(&[1, 2, 2, 5]), is_sorted_asc(&[3, 1]))",
      expected: "(true, false)",
    },
    {
      label: "空と 1 要素",
      expr: "(is_sorted_asc(&[]), is_sorted_asc(&[9]))",
      expected: "(true, true)",
    },
  ],
};

export default grader;
