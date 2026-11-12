import { defineProblem } from "../../../core/schemas";

export default defineProblem({
  id: "rust-integer-div-rem",
  stage: "write",
  language: "rust",
  scenario: "rust",
  copy: {
    title: "整数の割り算と余りで時刻を分解する",
    prompt: `## やること

次の 2 つの関数を書こう。

### split_time(total)

秒数 \`total\` を「時・分・秒」に分解し、タプル \`(時, 分, 秒)\` で返す。

\`\`\`rust
split_time(3725)   // (1, 2, 5)  … 1 時間 2 分 5 秒
split_time(59)     // (0, 0, 59)
\`\`\`

### wrap_index(i, n)

長さ \`n\` の円形の並びで、位置 \`i\`（負の数もありうる）を \`0..n\` の範囲に収めた値を返す。

\`\`\`rust
wrap_index(7, 5)    // 2
wrap_index(-1, 5)   // 4（後ろから 1 つ目）
\`\`\`

## ポイント

- 整数どうしの \`/\` は **切り捨て**（\`7 / 2\` は \`3\`）、\`%\` は余り
- 負の数の \`%\` は負になる（\`-1 % 5\` は \`-1\`）。常に 0 以上の余りがほしいときは \`i.rem_euclid(n)\`
- \`(a, b, c)\` は 3 つの値をまとめたタプル`,
    hints: [
      "時 = total / 3600、分 = total % 3600 / 60、秒 = total % 60",
      "`i.rem_euclid(n)` は負の i でも 0 以上の余りを返す",
    ],
  },
  initialCode: `fn split_time(total: u32) -> (u32, u32, u32) {
    todo!()
}

fn wrap_index(i: i32, n: i32) -> i32 {
    todo!()
}
`,
  solutionCode: `fn split_time(total: u32) -> (u32, u32, u32) {
    let h = total / 3600;
    let m = total % 3600 / 60;
    let s = total % 60;
    (h, m, s)
}

fn wrap_index(i: i32, n: i32) -> i32 {
    i.rem_euclid(n)
}
`,
});
