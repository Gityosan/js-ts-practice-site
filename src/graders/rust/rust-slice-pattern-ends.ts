import type { RustGraderDef } from "../../grade/types";

const grader: RustGraderDef = {
  kind: "rust",
  mode: "harness",
  cases: [
    { label: "先頭と末尾", expr: "ends(&[3, 9, 4])", expected: "Some((3, 4))" },
    { label: "1 要素と空", expr: "(ends(&[7]), ends(&[]))", expected: "(Some((7, 7)), None)" },
    {
      label: "describe 0〜2 個",
      expr: "[describe(&[]), describe(&[8]), describe(&[1, 2])]",
      expected: '["空", "1個: 8", "2個: 1,2"]',
    },
    {
      label: "describe 3 個以上",
      expr: "(describe(&[1, 2, 3, 4, 5]), describe(&[1, 2, 3]))",
      expected: '("先頭1 末尾5 他3個", "先頭1 末尾3 他1個")',
    },
    {
      label: "再帰で合計",
      expr: "(sum_rec(&[1, 2, 3]), sum_rec(&[]), sum_rec(&[-4, 4, 10]))",
      expected: "(6, 0, 10)",
    },
  ],
};

export default grader;
