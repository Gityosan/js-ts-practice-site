import { defineProblem } from "../../../core/schemas";

export default defineProblem({
  id: "rust-as-cast",
  stage: "write",
  language: "rust",
  scenario: "rust",
  copy: {
    title: "as キャストで型を変換する",
    prompt: `## やること

次の 3 つの関数を書こう。どれも **\`as\`** を使う。

### average3(a, b, c)

3 つの \`i32\` の平均を \`f64\` で返す。

\`\`\`rust
average3(1, 2, 3)   // 2.0
average3(1, 2, 4)   // 2.3333333333333335
\`\`\`

### to_percent(ratio)

0.0〜1.0 の割合をパーセントの整数に変換する（小数部分は **切り捨て**）。

\`\`\`rust
to_percent(0.756)  // 75
to_percent(1.0)    // 100
\`\`\`

### low_byte(x)

\`u32\` の下位 8 ビット（256 で割った余りと同じ）を \`u8\` で返す。

\`\`\`rust
low_byte(300)   // 44
low_byte(255)   // 255
\`\`\`

## ポイント

- \`a as f64\` で整数を浮動小数に変換できる。整数のまま割ると切り捨てられてしまう
- \`x as u32\` で浮動小数を整数にすると小数部分が切り捨てられる
- 大きい整数を小さい整数型に \`as\` すると、入りきらない上位ビットは捨てられる`,
    hints: [
      "`(a + b + c) as f64 / 3.0`",
      "`(ratio * 100.0) as u32`",
      "`x as u8` だけで下位 8 ビットになる",
    ],
  },
  initialCode: `fn average3(a: i32, b: i32, c: i32) -> f64 {
    todo!()
}

fn to_percent(ratio: f64) -> u32 {
    todo!()
}

fn low_byte(x: u32) -> u8 {
    todo!()
}
`,
  solutionCode: `fn average3(a: i32, b: i32, c: i32) -> f64 {
    (a + b + c) as f64 / 3.0
}

fn to_percent(ratio: f64) -> u32 {
    (ratio * 100.0) as u32
}

fn low_byte(x: u32) -> u8 {
    x as u8
}
`,
});
