import { defineProblem } from "../../../core/schemas";

export default defineProblem({
  id: "rust-ops-matrix-index",
  stage: "write",
  language: "rust",
  scenario: "rust",
  copy: {
    title: "Matrix に Index / IndexMut を実装",
    prompt: `## やること

行列 \`Matrix\` で \`m[(行, 列)]\` と書けるようにしよう。データは 1 次元の \`Vec<i32>\` に **行優先** で並べる（\`(r, c)\` は \`r * cols + c\` 番目）。

\`\`\`rust
struct Matrix {
    rows: usize,
    cols: usize,
    data: Vec<i32>,
}
\`\`\`

- \`Matrix::new(rows, cols)\` … 全部 0 の行列（用意済み）
- \`Index<(usize, usize)>\` … \`m[(r, c)]\` で要素を読む
- \`IndexMut<(usize, usize)>\` … \`m[(r, c)] = v\` で書く
- 範囲外（\`r >= rows\` または \`c >= cols\`）なら **panic** する（\`assert!\` を使う）。\`(0, 3)\` は 3 列の行列では範囲外だが、そのまま計算すると \`data\` の範囲内に収まってしまうので注意
- \`transpose(&self) -> Matrix\` … 転置（行と列を入れ替えた行列）。\`Index\` を使って書いてみよう

\`\`\`rust
let mut m = Matrix::new(2, 3);
m[(0, 1)] = 5;
m[(1, 2)] = 7;
m[(0, 1)]           // 5
m.transpose()[(2, 1)] // 7
\`\`\``,
    hints: [
      "`impl Index<(usize, usize)> for Matrix { type Output = i32; fn index(&self, (r, c): (usize, usize)) -> &i32 { ... } }`",
      '`assert!(r < self.rows && c < self.cols, "index out of range");` の後に `&self.data[r * self.cols + c]`。',
      "`transpose` は `let mut t = Matrix::new(self.cols, self.rows);` を作り、二重ループで `t[(c, r)] = self[(r, c)];`。",
    ],
  },
  initialCode: `use std::ops::{Index, IndexMut};

struct Matrix {
    rows: usize,
    cols: usize,
    data: Vec<i32>,
}

impl Matrix {
    fn new(rows: usize, cols: usize) -> Matrix {
        Matrix { rows, cols, data: vec![0; rows * cols] }
    }

    fn transpose(&self) -> Matrix {
        todo!()
    }
}

// ここに Index<(usize, usize)> と IndexMut<(usize, usize)> を実装する
`,
  solutionCode: `use std::ops::{Index, IndexMut};

struct Matrix {
    rows: usize,
    cols: usize,
    data: Vec<i32>,
}

impl Matrix {
    fn new(rows: usize, cols: usize) -> Matrix {
        Matrix { rows, cols, data: vec![0; rows * cols] }
    }

    fn transpose(&self) -> Matrix {
        let mut t = Matrix::new(self.cols, self.rows);
        for r in 0..self.rows {
            for c in 0..self.cols {
                t[(c, r)] = self[(r, c)];
            }
        }
        t
    }
}

impl Index<(usize, usize)> for Matrix {
    type Output = i32;

    fn index(&self, (r, c): (usize, usize)) -> &i32 {
        assert!(r < self.rows && c < self.cols, "index out of range");
        &self.data[r * self.cols + c]
    }
}

impl IndexMut<(usize, usize)> for Matrix {
    fn index_mut(&mut self, (r, c): (usize, usize)) -> &mut i32 {
        assert!(r < self.rows && c < self.cols, "index out of range");
        &mut self.data[r * self.cols + c]
    }
}
`,
});
