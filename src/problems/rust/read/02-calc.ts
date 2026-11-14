import { defineProblem } from "../../../core/schemas";

export default defineProblem({
  id: "rust-read-calc",
  stage: "read",
  language: "rust",
  scenario: "rust",
  copy: {
    title: "数字を変えて計算結果を見る",
    prompt: `## まず実行してみよう

**▶ 実行** を押すと、Rust Playground でコンパイル・実行されて、下の「出力プレビュー」に結果が出る（数秒かかる）。

\`a\` と \`b\` の数字を変えて、結果がどう変わるか見よう。

## コードを読んでみよう

\`\`\`rust
let a = 17;
let b = 5;
println!("{} / {} = {}", a, b, a / b);
println!("{} % {} = {}", a, b, a % b);
\`\`\`

- 整数どうしの \`/\` は **小数点以下を切り捨て**（17 / 5 は 3）
- \`%\` は **余り**（17 % 5 は 2）
- 小数で計算したいときは \`17.0 / 5.0\` のように **小数で書く**（f64 型）

**試してみよう:** \`b\` を \`0\` にすると？ → 実行時に「0 で割った」panic が起きる。Rust が危険な計算を止めてくれる。`,
    hints: [
      "`a` と `b` の数字を変えてみよう",
      "`let x = 17.0 / 5.0;` を足して小数の割り算と比べよう",
      "`b` を 0 にすると panic（0 除算）になる",
    ],
  },
  initialCode: `fn main() {
    let a = 17; // ← 数字を変えて ▶ 実行！
    let b = 5;
    println!("{} + {} = {}", a, b, a + b);
    println!("{} - {} = {}", a, b, a - b);
    println!("{} * {} = {}", a, b, a * b);
    println!("{} / {} = {}（整数の割り算は切り捨て）", a, b, a / b);
    println!("{} % {} = {}（余り）", a, b, a % b);
    println!("小数なら 17.0 / 5.0 = {}", 17.0 / 5.0);
}
`,
  solutionCode: `fn main() {
    let a = 17; // ← 数字を変えて ▶ 実行！
    let b = 5;
    println!("{} + {} = {}", a, b, a + b);
    println!("{} - {} = {}", a, b, a - b);
    println!("{} * {} = {}", a, b, a * b);
    println!("{} / {} = {}（整数の割り算は切り捨て）", a, b, a / b);
    println!("{} % {} = {}（余り）", a, b, a % b);
    println!("小数なら 17.0 / 5.0 = {}", 17.0 / 5.0);
}
`,
});
