import { defineProblem } from "../../../core/schemas";

export default defineProblem({
  id: "rust-early-return-block",
  stage: "write",
  language: "rust",
  scenario: "rust",
  copy: {
    title: "return で早期リターン・ブロック式で値を作る",
    prompt: `## やること

### safe_div(a, b)

\`a / b\`（整数の割り算）を返す。ただし \`b\` が 0 のときは割らずに **\`return\` で 0 を返す**。

\`\`\`rust
safe_div(10, 3)   // 3
safe_div(5, 0)    // 0
\`\`\`

### shipping_fee(weight)

荷物の重さ（kg）から送料を計算する。**ブロック式** を使って「基本料金」と「重量料金」を計算し、その和を返そう。

- 基本料金: 500
- 重量料金: 1kg あたり 120

\`\`\`rust
shipping_fee(0)   // 500
shipping_fee(3)   // 500 + 360 = 860
\`\`\`

## ポイント

\`\`\`rust
fn f(x: i32) -> i32 {
    if x < 0 {
        return -1;   // 途中で抜ける
    }
    let y = {
        let t = x * 2;
        t + 1        // ブロックの値
    };
    y
}
\`\`\`

\`if 条件 { ... }\` は条件が true のときだけ中を実行する（制御フローの章で詳しく学ぶ）。`,
    hints: [
      "`if b == 0 { return 0; }` の後に `a / b`",
      "`let base = { 500 };` `let by_weight = { let per_kg = 120; per_kg * weight };` `base + by_weight`",
    ],
  },
  initialCode: `fn safe_div(a: i32, b: i32) -> i32 {
    todo!()
}

fn shipping_fee(weight: u32) -> u32 {
    todo!()
}
`,
  solutionCode: `fn safe_div(a: i32, b: i32) -> i32 {
    if b == 0 {
        return 0;
    }
    a / b
}

fn shipping_fee(weight: u32) -> u32 {
    let base = 500;
    let by_weight = {
        let per_kg = 120;
        per_kg * weight
    };
    base + by_weight
}
`,
});
