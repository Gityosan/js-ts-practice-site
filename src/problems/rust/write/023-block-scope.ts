import { defineProblem } from "../../../core/schemas";

export default defineProblem({
  id: "rust-block-scope",
  stage: "write",
  language: "rust",
  scenario: "rust",
  copy: {
    title: "ブロックのスコープとシャドーイング",
    prompt: `## やること

関数 \`scope_demo(x)\` は、次の 2 つの値をタプル \`(内側の値, 外側の値)\` で返す。

- 内側の値: \`{ }\` ブロックの中で \`x\` を **10 倍した値でシャドーイング** し、さらに 1 を足したもの
- 外側の値: ブロックを抜けた後の \`x\`（**内側のシャドーイングの影響を受けない**ので元の値のまま）

\`\`\`rust
scope_demo(3)   // (31, 3)
scope_demo(0)   // (1, 0)
\`\`\`

骨格はできているので、\`todo!()\` の部分を埋めよう。

## ポイント

\`\`\`rust
let x = 1;
let inner = {
    let x = x * 100;   // ブロック内だけの新しい x
    x                  // ブロックの最後の式がブロックの値になる
};
// ここでの x は 1 のまま
\`\`\`

\`(a, b)\` は 2 つの値をまとめた **タプル**（複合型の章で詳しく学ぶ）。`,
    hints: [
      "ブロックの中で `let x = x * 10;` と書く",
      "ブロックの最後に `x + 1`（`;` なし）と書くとそれがブロックの値になる",
    ],
  },
  initialCode: `fn scope_demo(x: i32) -> (i32, i32) {
    let inner = {
        todo!()
    };
    (inner, x)
}
`,
  solutionCode: `fn scope_demo(x: i32) -> (i32, i32) {
    let inner = {
        let x = x * 10;
        x + 1
    };
    (inner, x)
}
`,
});
