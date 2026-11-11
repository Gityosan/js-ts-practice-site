import { defineProblem } from "../../../core/schemas";

export default defineProblem({
  id: "rust-tuple-swap",
  stage: "write",
  language: "rust",
  scenario: "rust",
  copy: {
    title: "タプルの要素を入れ替える",
    prompt: `## やること

2 つの関数を書こう。

### swap(pair)

\`(i32, bool)\` のタプルを受け取り、順番を入れ替えた \`(bool, i32)\` を返す。

\`\`\`rust
swap((7, true))    // (true, 7)
\`\`\`

### pair_sum(pair)

\`(i32, i32)\` のタプルの 2 つの要素の和を返す。**\`.0\` と \`.1\`** を使ってみよう。

\`\`\`rust
pair_sum((3, 4))   // 7
\`\`\`

## ポイント

- 分割代入: \`let (a, b) = pair;\`
- インデックス: \`pair.0\`, \`pair.1\`
- 新しいタプルは \`(b, a)\` のように丸括弧で作る`,
    hints: ["`let (n, flag) = pair; (flag, n)`", "`pair.0 + pair.1`"],
  },
  initialCode: `fn swap(pair: (i32, bool)) -> (bool, i32) {
    todo!()
}

fn pair_sum(pair: (i32, i32)) -> i32 {
    todo!()
}
`,
  solutionCode: `fn swap(pair: (i32, bool)) -> (bool, i32) {
    let (n, flag) = pair;
    (flag, n)
}

fn pair_sum(pair: (i32, i32)) -> i32 {
    pair.0 + pair.1
}
`,
});
