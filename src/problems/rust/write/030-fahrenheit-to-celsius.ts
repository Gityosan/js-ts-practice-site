import { defineProblem } from "../../../core/schemas";

export default defineProblem({
  id: "rust-fahrenheit-to-celsius",
  stage: "write",
  language: "rust",
  scenario: "rust",
  copy: {
    title: "華氏を摂氏に変換する（f64）",
    prompt: `## やること

華氏（°F）の温度を受け取り、摂氏（°C）に変換して返す関数 \`f_to_c\` を書こう。

変換式: **C = (F - 32) × 5 ÷ 9**

\`\`\`rust
f_to_c(212.0)  // 100.0
f_to_c(32.0)   // 0.0
f_to_c(-40.0)  // -40.0
\`\`\`

## ポイント

- 小数は \`f64\` を使う
- \`f64\` の計算では、数値リテラルにも小数点を付ける（\`32.0\`, \`5.0\`, \`9.0\`）。\`32\` と書くと整数なので \`f64\` から引けずエラーになる`,
    hints: ["`(f - 32.0) * 5.0 / 9.0`", "最後の式に `;` を付けない"],
  },
  initialCode: `fn f_to_c(f: f64) -> f64 {
    todo!()
}
`,
  solutionCode: `fn f_to_c(f: f64) -> f64 {
    (f - 32.0) * 5.0 / 9.0
}
`,
});
