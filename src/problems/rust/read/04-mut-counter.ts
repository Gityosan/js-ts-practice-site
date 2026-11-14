import { defineProblem } from "../../../core/schemas";

export default defineProblem({
  id: "rust-read-mut-counter",
  stage: "read",
  language: "rust",
  scenario: "rust",
  copy: {
    title: "mut を消すとどうなる？",
    prompt: `## まず実行してみよう

**▶ 実行** を押すと、Rust Playground でコンパイル・実行されて、下の「出力プレビュー」に結果が出る（数秒かかる）。

\`count\` に足す数を変えてみよう。そのあと **\`mut\` を消して** 実行すると、コンパイルエラー（E0384）が出るのを確かめよう（確かめたら元に戻す）。

## コードを読んでみよう

\`\`\`rust
let mut count = 0;
count += 3;
count += 4;
\`\`\`

- Rust の変数は **デフォルトで変更できない**
- 変更したい変数には \`let mut\` と書く
- \`count += 3\` は \`count = count + 3\` と同じ

**エラーメッセージを読む練習にもなる。** \`help:\` の行に直し方が書いてある。`,
    hints: [
      "`+= 3` の数字を変えてみよう",
      "`mut` を消すと E0384（不変の変数に再代入）",
      "シャドーイング `let count = count * 2;` なら mut なしでも新しい変数を作れる",
    ],
  },
  initialCode: `fn main() {
    let mut count = 0; // ← mut を消すとどうなる？
    println!("はじめ: {}", count);
    count += 3; // ← 数字を変えて ▶ 実行！
    println!("3 足した: {}", count);
    count += 4;
    println!("4 足した: {}", count);

    // シャドーイング: 同じ名前で新しい変数を作る（mut なしでも OK）
    let count = count * 10;
    println!("10 倍した新しい count: {}", count);
}
`,
  solutionCode: `fn main() {
    let mut count = 0; // ← mut を消すとどうなる？
    println!("はじめ: {}", count);
    count += 3; // ← 数字を変えて ▶ 実行！
    println!("3 足した: {}", count);
    count += 4;
    println!("4 足した: {}", count);

    // シャドーイング: 同じ名前で新しい変数を作る（mut なしでも OK）
    let count = count * 10;
    println!("10 倍した新しい count: {}", count);
}
`,
});
