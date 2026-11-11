import { defineProblem } from "../../../core/schemas";

export default defineProblem({
  id: "rust-as-cast-conv",
  stage: "write",
  language: "rust",
  scenario: "rust",
  copy: {
    title: "as でプリミティブ型を変換する",
    prompt: `## やること

\`as\` を使った変換を 5 つの小さな関数で練習しよう。

| 関数 | やること | 例 |
|---|---|---|
| \`average(v: &[i32]) -> f64\` | 平均（空なら 0.0）。割り算は f64 で | \`[1, 2]\` → \`1.5\` |
| \`trunc(x: f64) -> i32\` | 整数部分（as で切り捨て） | \`3.99\` → \`3\`、\`-2.7\` → \`-2\` |
| \`code_of(c: char) -> u32\` | 文字のコードポイント | \`'A'\` → \`65\` |
| \`from_byte(b: u8) -> char\` | バイトを文字に | \`97\` → \`'a'\` |
| \`low_byte(x: i32) -> u8\` | 下位 8 ビット（as で折り返し） | \`300\` → \`44\` |

- \`i32\` 同士の割り算は整数の割り算になる。片方でも f64 にしてから割ろう: \`sum as f64 / len as f64\`
- \`as\` は失敗しない代わりに、値を切り捨て・折り返す`,
    hints: [
      "average: `if v.is_empty() { return 0.0; }` → `sum as f64 / v.len() as f64`",
      "合計は i32 で足してから as f64 してよい（`let sum: i32 = v.iter().sum();`）",
      "他の 4 つは `x as i32` / `c as u32` / `b as char` / `x as u8` だけ",
    ],
  },
  initialCode: `fn average(v: &[i32]) -> f64 {
    todo!()
}

fn trunc(x: f64) -> i32 {
    todo!()
}

fn code_of(c: char) -> u32 {
    todo!()
}

fn from_byte(b: u8) -> char {
    todo!()
}

fn low_byte(x: i32) -> u8 {
    todo!()
}
`,
  solutionCode: `fn average(v: &[i32]) -> f64 {
    if v.is_empty() {
        return 0.0;
    }
    let sum: i32 = v.iter().sum();
    sum as f64 / v.len() as f64
}

fn trunc(x: f64) -> i32 {
    x as i32
}

fn code_of(c: char) -> u32 {
    c as u32
}

fn from_byte(b: u8) -> char {
    b as char
}

fn low_byte(x: i32) -> u8 {
    x as u8
}
`,
});
