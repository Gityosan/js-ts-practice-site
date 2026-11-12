import type { RustGraderDef } from "../../grade/types";

const grader: RustGraderDef = {
  kind: "rust",
  mode: "harness",
  cases: [
    {
      label: "形",
      expr: "(shape(&vec![vec![1, 2, 3], vec![4, 5, 6]]), shape(&vec![]), shape(&vec![vec![1], vec![2, 3]]))",
      expected: "(Some((2, 3)), None, None)",
    },
    {
      label: "転置",
      expr: "transpose(&vec![vec![1, 2, 3], vec![4, 5, 6]])",
      expected: "Some([[1, 4], [2, 5], [3, 6]])",
    },
    {
      label: "2×2 の積",
      expr: "mat_mul(&vec![vec![1, 2], vec![3, 4]], &vec![vec![5, 6], vec![7, 8]])",
      expected: "Some([[19, 22], [43, 50]])",
    },
    {
      label: "2×3 と 3×1",
      expr: "mat_mul(&vec![vec![1, 0, -1], vec![2, 3, 4]], &vec![vec![1], vec![2], vec![3]])",
      expected: "Some([[-2], [20]])",
    },
    {
      label: "サイズが合わない",
      expr: "mat_mul(&vec![vec![1, 2]], &vec![vec![1, 2]])",
      expected: "None",
    },
    {
      label: "単位行列を掛けても変わらない",
      expr: "mat_mul(&vec![vec![1, 0], vec![0, 1]], &vec![vec![9, -8], vec![7, 6]])",
      expected: "Some([[9, -8], [7, 6]])",
    },
  ],
};

export default grader;
