import { defineProblem } from "../../../core/schemas";

export default defineProblem({
  id: "rust-vec-2d-grid",
  stage: "write",
  language: "rust",
  scenario: "rust",
  copy: {
    title: "2 次元 Vec: 行列の転置と合計",
    prompt: `## やること

\`Vec<Vec<i32>>\` を行列（表）として扱う関数を書こう。

- \`make_grid(rows: usize, cols: usize) -> Vec<Vec<i32>>\` … \`grid[r][c] = r * cols + c\` の値を入れた行列（\`vec![vec![0; cols]; rows]\` で作ってから埋める）
- \`row_sums(g: &[Vec<i32>]) -> Vec<i32>\` … 各行の合計
- \`col_sums(g: &[Vec<i32>]) -> Vec<i32>\` … 各列の合計（行がなければ空）
- \`transpose(g: &[Vec<i32>]) -> Vec<Vec<i32>>\` … 転置（行と列を入れ替える）。\`2×3\` → \`3×2\`

\`\`\`rust
make_grid(2, 3);                      // [[0, 1, 2], [3, 4, 5]]
row_sums(&make_grid(2, 3));           // [3, 12]
col_sums(&make_grid(2, 3));           // [3, 5, 7]
transpose(&make_grid(2, 3));          // [[0, 3], [1, 4], [2, 5]]
\`\`\`

すべての行は同じ長さだと仮定してよい。列数は \`g[0].len()\`（空の行列に注意）。`,
    hints: [
      "make_grid: 二重 for で `g[r][c] = (r * cols + c) as i32;`",
      "col_sums: `let cols = if g.is_empty() { 0 } else { g[0].len() };` → `vec![0; cols]` に足し込む",
      "transpose: `out[c][r] = g[r][c]` となる `cols × rows` の行列",
    ],
  },
  initialCode: `fn make_grid(rows: usize, cols: usize) -> Vec<Vec<i32>> {
    todo!()
}

fn row_sums(g: &[Vec<i32>]) -> Vec<i32> {
    todo!()
}

fn col_sums(g: &[Vec<i32>]) -> Vec<i32> {
    todo!()
}

fn transpose(g: &[Vec<i32>]) -> Vec<Vec<i32>> {
    todo!()
}
`,
  solutionCode: `fn make_grid(rows: usize, cols: usize) -> Vec<Vec<i32>> {
    let mut g = vec![vec![0; cols]; rows];
    for r in 0..rows {
        for c in 0..cols {
            g[r][c] = (r * cols + c) as i32;
        }
    }
    g
}

fn row_sums(g: &[Vec<i32>]) -> Vec<i32> {
    let mut out = Vec::new();
    for row in g {
        out.push(row.iter().sum());
    }
    out
}

fn col_sums(g: &[Vec<i32>]) -> Vec<i32> {
    let cols = if g.is_empty() { 0 } else { g[0].len() };
    let mut out = vec![0; cols];
    for row in g {
        for (c, x) in row.iter().enumerate() {
            out[c] += x;
        }
    }
    out
}

fn transpose(g: &[Vec<i32>]) -> Vec<Vec<i32>> {
    let rows = g.len();
    let cols = if rows == 0 { 0 } else { g[0].len() };
    let mut out = vec![vec![0; rows]; cols];
    for r in 0..rows {
        for c in 0..cols {
            out[c][r] = g[r][c];
        }
    }
    out
}
`,
});
