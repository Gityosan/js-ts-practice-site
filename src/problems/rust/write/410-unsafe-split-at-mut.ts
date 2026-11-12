import { defineProblem } from "../../../core/schemas";

export default defineProblem({
  id: "rust-unsafe-split-safe-api",
  stage: "write",
  language: "rust",
  scenario: "rust",
  copy: {
    title: "split_at_mut で 1 つの配列を 2 か所同時に書き換える",
    prompt: `## やること

\`add_second_half(v: &mut [i32])\` を書こう。配列の **前半の各要素に、後半の対応する要素を足す**（長さが奇数のとき、真ん中の要素は後半に入れる）。

\`\`\`rust
let mut v = [1, 2, 3, 10, 20, 30];
add_second_half(&mut v);
// v は [11, 22, 33, 10, 20, 30]
\`\`\`

## ポイント

\`v[i] += v[i + mid]\` を \`for\` で書いても動くが、ここでは「同じスライスへの 2 つの可変参照」を作る標準の安全な API **\`split_at_mut\`** を使ってみよう。

\`\`\`rust
let mid = v.len() / 2;
let (front, back) = v.split_at_mut(mid);
// front と back は重ならないので、同時に &mut で使える
\`\`\`

\`front.iter_mut().zip(back.iter())\` で対応する要素をペアにできる。中では unsafe を使っているが、こちらは unsafe を書かなくてよい。`,
    hints: [
      "`let (front, back) = v.split_at_mut(v.len() / 2);`",
      "`for (a, b) in front.iter_mut().zip(back.iter()) { *a += *b; }`",
      "長さが奇数でも zip は短いほうに合わせて止まる",
    ],
  },
  initialCode: `fn add_second_half(v: &mut [i32]) {
    todo!()
}
`,
  solutionCode: `fn add_second_half(v: &mut [i32]) {
    let mid = v.len() / 2;
    let (front, back) = v.split_at_mut(mid);
    for (a, b) in front.iter_mut().zip(back.iter()) {
        *a += *b;
    }
}
`,
});
