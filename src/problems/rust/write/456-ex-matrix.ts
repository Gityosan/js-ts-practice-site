import { defineProblem } from "../../../core/schemas";

export default defineProblem({
  id: "rust-ex-matrix-multiply",
  stage: "write",
  language: "rust",
  scenario: "rust",
  copy: {
    title: "総合: 行列の積と転置",
    prompt: `## やること

行列を \`Vec<Vec<i64>>\`（行の Vec）で表し、次の関数を書こう。

\`\`\`rust
type Matrix = Vec<Vec<i64>>;
\`\`\`

| 関数 | 動き |
|---|---|
| \`shape(m: &Matrix) -> Option<(usize, usize)>\` | \`(行数, 列数)\`。行が 0 個、列が 0 個、または **行ごとに長さが違う** なら \`None\` |
| \`transpose(m: &Matrix) -> Option<Matrix>\` | 転置（行と列を入れ替える）。形が不正なら \`None\` |
| \`mat_mul(a: &Matrix, b: &Matrix) -> Option<Matrix>\` | 行列の積。形が不正、または \`a\` の列数 ≠ \`b\` の行数なら \`None\` |

行列の積 \`C = A × B\` の各要素は次の式で計算する（\`A\` が n×m、\`B\` が m×p なら \`C\` は n×p）。

\`\`\`text
C[i][j] = A[i][0]*B[0][j] + A[i][1]*B[1][j] + ... + A[i][m-1]*B[m-1][j]
\`\`\`

\`\`\`rust
mat_mul(&vec![vec![1, 2], vec![3, 4]], &vec![vec![5, 6], vec![7, 8]])
// Some([[19, 22], [43, 50]])
\`\`\``,
    hints: [
      "shape: `let cols = m.first()?.len(); if cols == 0 || m.iter().any(|r| r.len() != cols) { return None; }`",
      "transpose: `(0..c).map(|j| (0..r).map(|i| m[i][j]).collect()).collect()`",
      "mat_mul: `let (n, m1) = shape(a)?; let (m2, p) = shape(b)?; if m1 != m2 { return None; }` のあと 3 重ループ（または `(0..m1).map(|k| a[i][k] * b[k][j]).sum()`）",
    ],
  },
  initialCode: `type Matrix = Vec<Vec<i64>>;

fn shape(m: &Matrix) -> Option<(usize, usize)> {
    todo!()
}

fn transpose(m: &Matrix) -> Option<Matrix> {
    todo!()
}

fn mat_mul(a: &Matrix, b: &Matrix) -> Option<Matrix> {
    todo!()
}
`,
  solutionCode: `type Matrix = Vec<Vec<i64>>;

fn shape(m: &Matrix) -> Option<(usize, usize)> {
    let cols = m.first()?.len();
    if cols == 0 || m.iter().any(|r| r.len() != cols) {
        return None;
    }
    Some((m.len(), cols))
}

fn transpose(m: &Matrix) -> Option<Matrix> {
    let (r, c) = shape(m)?;
    Some((0..c).map(|j| (0..r).map(|i| m[i][j]).collect()).collect())
}

fn mat_mul(a: &Matrix, b: &Matrix) -> Option<Matrix> {
    let (n, m1) = shape(a)?;
    let (m2, p) = shape(b)?;
    if m1 != m2 {
        return None;
    }
    let mut c = vec![vec![0; p]; n];
    for i in 0..n {
        for j in 0..p {
            c[i][j] = (0..m1).map(|k| a[i][k] * b[k][j]).sum();
        }
    }
    Some(c)
}
`,
});
