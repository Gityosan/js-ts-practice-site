import { defineProblem } from "../../../core/schemas";

export default defineProblem({
  id: "rust-read-iter-chain",
  stage: "read",
  language: "rust",
  scenario: "rust",
  copy: {
    title: "イテレータの条件を変えて合計を見る",
    prompt: `## まず実行してみよう

**▶ 実行** を押すと、Rust Playground でコンパイル・実行されて、下の「出力プレビュー」に結果が出る（数秒かかる）。

範囲（\`1..=10\`）や条件（\`% 2 == 0\`）を変えて、結果がどう変わるか見よう。

## コードを読んでみよう

\`\`\`rust
let total: i32 = (1..=10)
    .filter(|n| n % 2 == 0)
    .map(|n| n * n)
    .sum();
\`\`\`

- \`(1..=10)\` … 1〜10 の数を順に流す
- \`.filter(|n| 条件)\` … 条件が真のものだけ通す
- \`.map(|n| 変換)\` … 1 つずつ変換する
- \`.sum()\` … 全部足す
- \`|n| ...\` は **クロージャ**（その場で書く小さな関数）`,
    hints: [
      "`% 2 == 0` を `% 3 == 0` にしてみよう",
      "`n * n` を `n * 10` にしてみよう",
      "`.collect::<Vec<_>>()` にすると途中の値が見える",
    ],
  },
  initialCode: `fn main() {
    let evens: Vec<i32> = (1..=10).filter(|n| n % 2 == 0).collect(); // ← 条件を変えて ▶ 実行！
    println!("偶数: {:?}", evens);

    let squares: Vec<i32> = evens.iter().map(|n| n * n).collect();
    println!("2 乗: {:?}", squares);

    let total: i32 = squares.iter().sum();
    println!("合計: {}", total);
}
`,
  solutionCode: `fn main() {
    let evens: Vec<i32> = (1..=10).filter(|n| n % 2 == 0).collect(); // ← 条件を変えて ▶ 実行！
    println!("偶数: {:?}", evens);

    let squares: Vec<i32> = evens.iter().map(|n| n * n).collect();
    println!("2 乗: {:?}", squares);

    let total: i32 = squares.iter().sum();
    println!("合計: {}", total);
}
`,
});
