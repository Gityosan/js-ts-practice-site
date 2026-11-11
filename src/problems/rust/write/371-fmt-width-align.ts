import { defineProblem } from "../../../core/schemas";

export default defineProblem({
  id: "rust-fmt-table-align",
  stage: "write",
  language: "rust",
  scenario: "rust",
  copy: {
    title: "幅と寄せで表を揃える",
    prompt: `## やること

商品データから、列がそろった表を表示しよう。期待する出力:

\`\`\`text
  No|商品        |      価格
 001|apple     |  120.00
 002|banana    |   80.50
 010|melon     | 1500.00
--------------------------
  合計: 1700.50
\`\`\`

- \`No\` 列: 幅 4 の右寄せ。データ行は **幅 4 で、番号を 3 桁ゼロ埋め**（\`{:>4}\` に \`format!("{:03}", n)\` を渡す、など）
- 商品列: 幅 10 の左寄せ \`{:<10}\`
- 価格列: 幅 8 の右寄せ・小数 2 桁 \`{:>8.2}\`
- 区切り線は \`-\` を 26 個（\`"-".repeat(26)\` または \`{:-<26}\` に空文字を渡す）
- 合計行は \`  合計: \` のあとに小数 2 桁

※ Rust の幅指定は **文字数** で数える。全角の「商品」も 2 文字として扱われるので、\`{:<10}\` だと後ろに空白が 8 個付く。画面上では全角文字が半角 2 個分の幅を取るため、見出し行だけ \`|\` が少しずれて見えるが、それで正しい。

## 採点

標準出力を比較する（行末の空白は無視）。`,
    hints: [
      '見出し: `println!("{:>4}|{:<10}|{:>8}", "No", "商品", "価格");`',
      'データ行の番号: `format!("{:03}", no)` を `{:>4}` に渡す',
      "価格は `{:>8.2}`、合計は for 文で足し合わせて `{:.2}`",
    ],
  },
  initialCode: `fn main() {
    let items = [(1, "apple", 120.0), (2, "banana", 80.5), (10, "melon", 1500.0)];
    // ここで表を表示しよう
}
`,
  solutionCode: `fn main() {
    let items = [(1, "apple", 120.0), (2, "banana", 80.5), (10, "melon", 1500.0)];
    println!("{:>4}|{:<10}|{:>8}", "No", "商品", "価格");
    let mut total = 0.0;
    for (no, name, price) in items {
        println!("{:>4}|{:<10}|{:>8.2}", format!("{:03}", no), name, price);
        total += price;
    }
    println!("{}", "-".repeat(26));
    println!("  合計: {:.2}", total);
}
`,
});
