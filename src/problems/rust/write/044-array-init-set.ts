import { defineProblem } from "../../../core/schemas";

export default defineProblem({
  id: "rust-array-init-set",
  stage: "write",
  language: "rust",
  scenario: "rust",
  copy: {
    title: "[値; 個数] で配列を作って書き換える",
    prompt: `## やること

### marked(pos, value)

長さ 5 の配列を **すべて 0 で** 作り、添字 \`pos\` の要素だけを \`value\` にして返す関数。

\`\`\`rust
marked(2, 9)   // [0, 0, 9, 0, 0]
marked(0, -1)  // [-1, 0, 0, 0, 0]
\`\`\`

### identity3()

3 行 3 列の **単位行列**（対角線だけ 1、他は 0）を 2 次元配列で返す関数。

\`\`\`rust
identity3()   // [[1, 0, 0], [0, 1, 0], [0, 0, 1]]
\`\`\`

## ポイント

- \`[0; 5]\` で 0 が 5 個並んだ配列ができる
- 書き換えるには \`let mut a = [0; 5];\` と \`mut\` を付けて \`a[pos] = value;\`
- 2 次元配列は \`[[0; 3]; 3]\`。要素は \`m[行][列]\` で指定する`,
    hints: [
      "`let mut a = [0; 5]; a[pos] = value; a`",
      "`let mut m = [[0; 3]; 3];` を作り `m[0][0] = 1;` などを 3 回",
    ],
  },
  initialCode: `fn marked(pos: usize, value: i32) -> [i32; 5] {
    todo!()
}

fn identity3() -> [[i32; 3]; 3] {
    todo!()
}
`,
  solutionCode: `fn marked(pos: usize, value: i32) -> [i32; 5] {
    let mut a = [0; 5];
    a[pos] = value;
    a
}

fn identity3() -> [[i32; 3]; 3] {
    let mut m = [[0; 3]; 3];
    m[0][0] = 1;
    m[1][1] = 1;
    m[2][2] = 1;
    m
}
`,
});
