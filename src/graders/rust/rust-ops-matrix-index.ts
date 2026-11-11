import type { RustGraderDef } from "../../grade/types";

const grader: RustGraderDef = {
  kind: "rust",
  mode: "harness",
  cases: [
    { label: "初期値は 0", expr: "Matrix::new(2, 2)[(1, 1)]", expected: "0" },
    {
      label: "書いて読む",
      expr: "{ let mut m = Matrix::new(2, 3); m[(0, 1)] = 5; m[(1, 2)] = 7; (m[(0, 1)], m[(1, 2)], m.data.clone()) }",
      expected: "(5, 7, [0, 5, 0, 0, 0, 7])",
    },
    {
      label: "+= も使える",
      expr: "{ let mut m = Matrix::new(1, 1); m[(0, 0)] += 4; m[(0, 0)] += 4; m[(0, 0)] }",
      expected: "8",
    },
    {
      label: "列が範囲外なら panic",
      expr: "std::panic::catch_unwind(|| { let m = Matrix::new(2, 3); m[(0, 3)] }).is_err()",
      expected: "true",
    },
    {
      label: "転置",
      expr: "{ let mut m = Matrix::new(2, 3); m[(0, 1)] = 5; m[(1, 2)] = 7; let t = m.transpose(); (t.rows, t.cols, t[(1, 0)], t[(2, 1)]) }",
      expected: "(3, 2, 5, 7)",
    },
  ],
};

export default grader;
