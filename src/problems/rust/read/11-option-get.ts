import { defineProblem } from "../../../core/schemas";

export default defineProblem({
  id: "rust-read-option-get",
  stage: "read",
  language: "rust",
  scenario: "rust",
  copy: {
    title: "番号を変えて Option（Some / None）を見る",
    prompt: `## まず実行してみよう

**▶ 実行** を押すと、Rust Playground でコンパイル・実行されて、下の「出力プレビュー」に結果が出る（数秒かかる）。

\`index\` の数字を変えて、\`Some\` と \`None\` のどちらになるか見よう。

## コードを読んでみよう

\`\`\`rust
match scores.get(index) {
    Some(s) => println!("{} 番目は {} 点", index, s),
    None => println!("{} 番目はありません", index),
}
\`\`\`

- Rust には **null が無い**。「無いかもしれない値」は \`Option\` 型で表す
- \`get\` は、あれば \`Some(値)\`、無ければ \`None\` を返す
- \`match\` で両方の場合を必ず書く（書き忘れるとコンパイルエラー）
- \`scores[index]\` と書くと、範囲外のとき panic する

**試してみよう:** 範囲外の番号（10 など）を入れても、\`get\` なら panic せず None になる。`,
    hints: [
      "`index` を 0〜2 と 10 で比べよう",
      "`unwrap_or(&0)` で None のときの代わりの値を指定できる",
      "`scores[10]` にすると panic",
    ],
  },
  initialCode: `fn main() {
    let scores = vec![80, 65, 92];
    let index = 1; // ← 番号を変えて ▶ 実行！

    match scores.get(index) {
        Some(s) => println!("{} 番目は {} 点", index, s),
        None => println!("{} 番目はありません", index),
    }

    let value = scores.get(index).unwrap_or(&0);
    println!("無いときは 0 として扱うと: {}", value);
}
`,
  solutionCode: `fn main() {
    let scores = vec![80, 65, 92];
    let index = 1; // ← 番号を変えて ▶ 実行！

    match scores.get(index) {
        Some(s) => println!("{} 番目は {} 点", index, s),
        None => println!("{} 番目はありません", index),
    }

    let value = scores.get(index).unwrap_or(&0);
    println!("無いときは 0 として扱うと: {}", value);
}
`,
});
