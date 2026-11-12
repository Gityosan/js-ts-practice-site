import { defineProblem } from "../../../core/schemas";

export default defineProblem({
  id: "rust-fmt-println-basics",
  stage: "write",
  language: "rust",
  scenario: "rust",
  copy: {
    title: "println! で自己紹介を表示する",
    prompt: `## やること

変数 \`name\`, \`age\`, \`langs\` を使って、次の 4 行をそのまま表示しよう。

\`\`\`text
名前: Ferris
年齢: 7 歳
好きな言語: ["Rust", "C"]
Ferris は来年 8 歳になる
\`\`\`

- 1 行目と 2 行目は \`{}\` か **インライン変数** \`{name}\` を使う
- 3 行目は \`Vec\` なので **Debug 表示** \`{:?}\` が必要（\`{}\` だとコンパイルエラー）
- 4 行目の「8」は \`age + 1\` の計算結果。インライン変数には式を書けないので、\`{}\` と引数で渡す

## 採点

標準出力を比較する。\`fn main\` を含めて全体を書く。`,
    hints: [
      '`println!("名前: {name}");` のようにインライン変数が使える',
      'Vec は `{:?}` で `["Rust", "C"]` のように表示される',
      '`println!("{name} は来年 {} 歳になる", age + 1);`',
    ],
  },
  initialCode: `fn main() {
    let name = "Ferris";
    let age = 7;
    let langs = vec!["Rust", "C"];
    // ここで 4 行を表示しよう
}
`,
  solutionCode: `fn main() {
    let name = "Ferris";
    let age = 7;
    let langs = vec!["Rust", "C"];
    println!("名前: {name}");
    println!("年齢: {} 歳", age);
    println!("好きな言語: {:?}", langs);
    println!("{name} は来年 {} 歳になる", age + 1);
}
`,
});
