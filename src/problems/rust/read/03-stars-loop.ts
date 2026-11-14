import { defineProblem } from "../../../core/schemas";

export default defineProblem({
  id: "rust-read-stars-loop",
  stage: "read",
  language: "rust",
  scenario: "rust",
  copy: {
    title: "くり返す回数を変えて ★ を並べる",
    prompt: `## まず実行してみよう

**▶ 実行** を押すと、Rust Playground でコンパイル・実行されて、下の「出力プレビュー」に結果が出る（数秒かかる）。

\`0..5\` の \`5\` を変えて、★ の数を変えよう。

## コードを読んでみよう

\`\`\`rust
for _ in 0..5 {
    print!("★");
}
println!();
\`\`\`

- \`for _ in 0..5\` … 0〜4 の 5 回くり返す。\`_\` は「回数の番号は使わない」の印
- \`print!\` は改行しない、\`println!\` は改行する
- 最後の \`println!();\` は改行だけ出す

**試してみよう:** \`0..5\` を \`0..=5\` にすると何個になる？`,
    hints: [
      "`5` を `10` にしてみよう",
      "`..=` にすると最後の数も含む",
      "2 つ目のループの `i` を使うと番号付きで表示できる",
    ],
  },
  initialCode: `fn main() {
    for _ in 0..5 { // ← 5 を変えて ▶ 実行！
        print!("★");
    }
    println!();

    for i in 1..=3 {
        println!("{}行目: {}", i, "☆".repeat(i));
    }
}
`,
  solutionCode: `fn main() {
    for _ in 0..5 { // ← 5 を変えて ▶ 実行！
        print!("★");
    }
    println!();

    for i in 1..=3 {
        println!("{}行目: {}", i, "☆".repeat(i));
    }
}
`,
});
