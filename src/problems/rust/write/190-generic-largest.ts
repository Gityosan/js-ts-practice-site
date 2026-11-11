import { defineProblem } from "../../../core/schemas";

export default defineProblem({
  id: "rust-generic-largest",
  stage: "write",
  language: "rust",
  scenario: "rust",
  copy: {
    title: "ジェネリックな largest 関数",
    prompt: `## やること

スライスの中で一番大きい値を返す **ジェネリック関数** \`largest\` を書こう。\`i32\` でも \`f64\` でも \`char\` でも動くようにする。

\`\`\`rust
largest(&[3, 7, 2])        // 7
largest(&[1.5, -2.0])      // 1.5
largest(&['x', 'b', 'z'])  // 'z'
\`\`\`

- 型パラメータ \`T\` には **トレイト境界** が必要: 比較するために \`PartialOrd\`、スライスから値をコピーして取り出すために \`Copy\`
- スライスは空でないものとする

\`\`\`rust
fn largest<T: PartialOrd + Copy>(list: &[T]) -> T
\`\`\``,
    hints: [
      "最初の要素 `list[0]` を暫定の最大値にする（Copy なので取り出せる）",
      "`for &x in list` で 1 つずつコピーして取り出し、`x > max` なら更新",
      "最後に `max` を返す（`;` を付けない）",
    ],
  },
  initialCode: `fn largest<T: PartialOrd + Copy>(list: &[T]) -> T {
    todo!()
}
`,
  solutionCode: `fn largest<T: PartialOrd + Copy>(list: &[T]) -> T {
    let mut max = list[0];
    for &x in list {
        if x > max {
            max = x;
        }
    }
    max
}
`,
});
