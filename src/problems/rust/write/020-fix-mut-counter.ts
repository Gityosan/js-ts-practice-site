import { defineProblem } from "../../../core/schemas";

export default defineProblem({
  id: "rust-fix-mut-counter",
  stage: "write",
  language: "rust",
  scenario: "rust",
  copy: {
    title: "【エラーを直す】mut を付けて合計を数える",
    prompt: `## やること

初期コードは **コンパイルエラー** になる。原因を見つけて直そう。

関数 \`sum_to(n)\` は 1 から \`n\` までの合計を返したい。

\`\`\`rust
sum_to(4)  // 1 + 2 + 3 + 4 = 10
sum_to(0)  // 0
\`\`\`

## ポイント

- \`let\` で作った変数はそのままでは **書き換えられない**（E0384）
- 値を変えたい変数には \`mut\` を付ける
- \`for i in 1..=n { ... }\` は 1 から n まで（n を含む）繰り返す（制御フローの章で詳しく学ぶ）`,
    hints: [
      "エラーメッセージの `cannot assign twice to immutable variable` に注目",
      "`let total = 0;` を `let mut total = 0;` にする",
    ],
  },
  initialCode: `fn sum_to(n: u32) -> u32 {
    let total = 0;
    for i in 1..=n {
        total += i;
    }
    total
}
`,
  solutionCode: `fn sum_to(n: u32) -> u32 {
    let mut total = 0;
    for i in 1..=n {
        total += i;
    }
    total
}
`,
});
