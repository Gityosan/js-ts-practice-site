import { defineProblem } from "../../../core/schemas";

export default defineProblem({
  id: "rust-shadowing-steps",
  stage: "write",
  language: "rust",
  scenario: "rust",
  copy: {
    title: "シャドーイングで段階的に計算する",
    prompt: `## やること

整数 \`x\` を受け取り、次の順に計算した結果を返す関数 \`steps\` を書こう。
**\`mut\` を使わず、シャドーイング（\`let x = ...;\` の繰り返し）で** 書いてみること。

- 1 を足す
- 3 倍する
- 4 を引く

\`\`\`rust
steps(2)   // (2 + 1) * 3 - 4 = 5
steps(0)   // (0 + 1) * 3 - 4 = -1
\`\`\`

## シャドーイングとは

\`\`\`rust
let x = 10;
let x = x + 5;  // 前の x を使って新しい x を作る（15）
\`\`\`

同じ名前で \`let\` し直すと、前の変数は隠れて新しい変数が使われる。`,
    hints: [
      "`let x = x + 1;` のように 1 行ずつ書く",
      "最後に `x` だけを書けば（`;` なし）それが戻り値",
    ],
  },
  initialCode: `fn steps(x: i32) -> i32 {
    // シャドーイングで 3 段階の計算をしよう
    todo!()
}
`,
  solutionCode: `fn steps(x: i32) -> i32 {
    let x = x + 1;
    let x = x * 3;
    let x = x - 4;
    x
}
`,
});
