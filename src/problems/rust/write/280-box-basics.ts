import { defineProblem } from "../../../core/schemas";

export default defineProblem({
  id: "rust-box-basics",
  stage: "write",
  language: "rust",
  scenario: "rust",
  copy: {
    title: "Box に入れて、取り出す",
    prompt: `## やること

\`Box<T>\` の基本操作を 3 つの関数で練習しよう。

- \`boxed(x: i32) -> Box<i32>\` … \`x\` を Box に入れて返す
- \`add_boxes(a: Box<i32>, b: Box<i32>) -> i32\` … 2 つの Box の中身を足した値を返す
- \`unbox_string(b: Box<String>) -> String\` … Box の中の String を **取り出して** 返す（コピーしない）

\`\`\`rust
let b = boxed(5);           // Box(5)。Debug 表示は 5
add_boxes(boxed(2), boxed(3)) // 5
unbox_string(Box::new(String::from("hi"))) // "hi"
\`\`\`

## 使う文法

- \`Box::new(値)\` でヒープに置く
- \`*b\` で中身を参照外しする。\`Box\` だけは \`*b\` で中身をムーブして取り出せる`,
    hints: [
      "`Box::new(x)` で Box を作る。",
      "`*a + *b` で中身同士を足せる。",
      "`*b` と書けば Box<String> から String を取り出せる。",
    ],
  },
  initialCode: `fn boxed(x: i32) -> Box<i32> {
    todo!()
}

fn add_boxes(a: Box<i32>, b: Box<i32>) -> i32 {
    todo!()
}

fn unbox_string(b: Box<String>) -> String {
    todo!()
}
`,
  solutionCode: `fn boxed(x: i32) -> Box<i32> {
    Box::new(x)
}

fn add_boxes(a: Box<i32>, b: Box<i32>) -> i32 {
    *a + *b
}

fn unbox_string(b: Box<String>) -> String {
    *b
}
`,
});
