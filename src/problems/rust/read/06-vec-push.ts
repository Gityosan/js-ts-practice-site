import { defineProblem } from "../../../core/schemas";

export default defineProblem({
  id: "rust-read-vec-push",
  stage: "read",
  language: "rust",
  scenario: "rust",
  copy: {
    title: "Vec に要素を足してみる",
    prompt: `## まず実行してみよう

**▶ 実行** を押すと、Rust Playground でコンパイル・実行されて、下の「出力プレビュー」に結果が出る（数秒かかる）。

\`push\` の行を増やしたり中身を変えたりして、Vec の中身と長さを見よう。

## コードを読んでみよう

\`\`\`rust
let mut fruits = vec!["りんご", "みかん"];
fruits.push("ぶどう");
println!("{:?}", fruits);
\`\`\`

- \`vec![...]\` … Vec（伸び縮みする配列）を作るマクロ
- \`push\` で末尾に追加。変更するので \`let mut\` が必要
- \`{:?}\` は **Debug 表示**（Vec の中身をそのまま表示できる）
- \`fruits.len()\` で長さ、\`fruits[0]\` で先頭

**試してみよう:** \`fruits[10]\` を表示すると？ → 範囲外なので panic。\`fruits.get(10)\` なら \`None\` が返る。`,
    hints: [
      '`fruits.push("もも");` を足してみよう',
      "`fruits.pop();` で末尾を取り出せる",
      "`{:?}` を `{}` にするとエラー（Vec は Display を持たない）",
    ],
  },
  initialCode: `fn main() {
    let mut fruits = vec!["りんご", "みかん"];
    fruits.push("ぶどう"); // ← 行を増やしたり中身を変えて ▶ 実行！
    println!("中身: {:?}", fruits);
    println!("長さ: {}", fruits.len());
    println!("先頭: {}", fruits[0]);
    println!("10 番目: {:?}", fruits.get(10)); // 無いので None
}
`,
  solutionCode: `fn main() {
    let mut fruits = vec!["りんご", "みかん"];
    fruits.push("ぶどう"); // ← 行を増やしたり中身を変えて ▶ 実行！
    println!("中身: {:?}", fruits);
    println!("長さ: {}", fruits.len());
    println!("先頭: {}", fruits[0]);
    println!("10 番目: {:?}", fruits.get(10)); // 無いので None
}
`,
});
