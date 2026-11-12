import type { RustGraderDef } from "../../grade/types";

const grader: RustGraderDef = {
  kind: "rust",
  mode: "harness",
  cases: [
    {
      label: "中間順は昇順",
      expr: "inorder(&build(&[5, 3, 8, 1, 4, 9]))",
      expected: "[1, 3, 4, 5, 8, 9]",
    },
    {
      label: "空の木",
      expr: "(inorder(&build(&[])), height(&build(&[])), sum(&build(&[])))",
      expected: "([], 0, 0)",
    },
    { label: "高さ（バランス）", expr: "height(&build(&[5, 3, 8]))", expected: "2" },
    { label: "高さ（一直線）", expr: "height(&build(&[1, 2, 3, 4]))", expected: "4" },
    { label: "合計", expr: "sum(&build(&[5, 3, 8, 1]))", expected: "17" },
  ],
};

export default grader;
