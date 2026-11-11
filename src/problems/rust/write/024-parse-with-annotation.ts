import { defineProblem } from "../../../core/schemas";

export default defineProblem({
  id: "rust-parse-with-annotation",
  stage: "write",
  language: "rust",
  scenario: "rust",
  copy: {
    title: "型注釈を付けて文字列を数値に変換する",
    prompt: `## やること

文字列で書かれた 2 つの整数を受け取り、その和を返す関数 \`add_strs\` を書こう。

\`\`\`rust
add_strs("12", "30")    // 42
add_strs("-5", "5")     // 0
add_strs("3000000000", "1")  // 3000000001（i32 には入らない大きさ）
\`\`\`

戻り値の型は \`i64\`。入力はいつも正しい整数の文字列だと仮定してよい。

## parse と型注釈

\`\`\`rust
let n: i64 = "42".parse().unwrap();
let m = "42".parse::<i64>().unwrap();   // ::<型> でも指定できる
\`\`\`

- \`parse()\` は「何の型に変換するか」を **型注釈** から決める。注釈がないとエラー（E0282）
- \`.unwrap()\` は変換結果から中身を取り出す（失敗していれば panic）
- 前後の空白があると失敗するので注意（今回は空白なしの入力だけ）

\`i32\` の最大値は約 21 億。30 億は入らないので \`i64\` を使う。`,
    hints: ["`let x: i64 = a.parse().unwrap();`", "b も同じように変換して `x + y` を返す"],
  },
  initialCode: `fn add_strs(a: &str, b: &str) -> i64 {
    todo!()
}
`,
  solutionCode: `fn add_strs(a: &str, b: &str) -> i64 {
    let a: i64 = a.parse().unwrap();
    let b: i64 = b.parse().unwrap();
    a + b
}
`,
});
