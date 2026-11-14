import { defineProblem } from "../../../core/schemas";

export default defineProblem({
  id: "rust-read-ownership-clone",
  stage: "read",
  language: "rust",
  scenario: "rust",
  copy: {
    title: ".clone() を消して所有権エラーを見る",
    prompt: `## まず実行してみよう

**▶ 実行** を押すと、Rust Playground でコンパイル・実行されて、下の「出力プレビュー」に結果が出る（数秒かかる）。

まずはそのまま実行。次に **\`.clone()\` を消して** 実行し、コンパイルエラー（E0382: move した後の値を使った）を確かめよう（確かめたら元に戻す）。

## コードを読んでみよう

\`\`\`rust
let s1 = String::from("hello");
let s2 = s1.clone(); // 中身ごと複製
println!("{} {}", s1, s2);
\`\`\`

- \`String\` は **所有権** を持つ。\`let s2 = s1;\` と書くと、所有権が s2 に **移動（move）** して s1 は使えなくなる
- \`.clone()\` で中身を複製すれば、s1 も s2 もそれぞれ使える
- 数値（\`i32\` など）は \`Copy\` なので、代入してもコピーされて両方使える

**エラーの \`help:\` 行を見ると、\`.clone()\` を足せという提案が書いてある。**`,
    hints: [
      "`.clone()` を消すと E0382",
      "数値 `let a = 5; let b = a;` なら両方使える（Copy）",
      "`&s1`（借用）で渡すのも、所有権を移さない方法",
    ],
  },
  initialCode: `fn main() {
    let s1 = String::from("hello");
    let s2 = s1.clone(); // ← .clone() を消すとどうなる？
    println!("s1 = {}, s2 = {}", s1, s2);

    // 数値は Copy なので代入しても両方使える
    let a = 5;
    let b = a;
    println!("a = {}, b = {}", a, b);

    // 借用（&）なら所有権は移らない
    let len = length(&s1);
    println!("{} の長さは {}", s1, len);
}

fn length(s: &String) -> usize {
    s.len()
}
`,
  solutionCode: `fn main() {
    let s1 = String::from("hello");
    let s2 = s1.clone(); // ← .clone() を消すとどうなる？
    println!("s1 = {}, s2 = {}", s1, s2);

    // 数値は Copy なので代入しても両方使える
    let a = 5;
    let b = a;
    println!("a = {}, b = {}", a, b);

    // 借用（&）なら所有権は移らない
    let len = length(&s1);
    println!("{} の長さは {}", s1, len);
}

fn length(s: &String) -> usize {
    s.len()
}
`,
});
