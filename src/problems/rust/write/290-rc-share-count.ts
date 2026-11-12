import { defineProblem } from "../../../core/schemas";

export default defineProblem({
  id: "rust-rc-share-count",
  stage: "write",
  language: "rust",
  scenario: "rust",
  copy: {
    title: "Rc で共有して数える",
    prompt: `## やること

\`Rc<T>\` で 1 つのデータを共有し、参照カウントの動きを確かめよう。

- \`share(data: Vec<i32>, n: usize) -> Vec<Rc<Vec<i32>>>\` … \`data\` を **1 つだけ** ヒープに置き、それを指す \`Rc\` を \`n\` 個並べた Vec を返す（中身をコピーしてはいけない）
- \`total(handles: &[Rc<Vec<i32>>]) -> i32\` … 各ハンドルが指す Vec の合計を **すべて足した** 値（同じデータを n 回足すことになる）

\`\`\`rust
let hs = share(vec![1, 2, 3], 3);
Rc::strong_count(&hs[0])   // 3
Rc::ptr_eq(&hs[0], &hs[2]) // true（同じ実体）
total(&hs)                 // 18（6 × 3）
\`\`\`

\`n\` が 0 のときは空の Vec を返す（\`data\` は捨てられる）。`,
    hints: [
      "まず `let rc = Rc::new(data);` を 1 回だけ作る。",
      "`(0..n).map(|_| Rc::clone(&rc)).collect()` で n 個のハンドルを作る。元の `rc` は関数の最後で破棄されるのでカウントは n になる。",
      "`total` は `handles.iter().map(|h| h.iter().sum::<i32>()).sum()`。",
    ],
  },
  initialCode: `use std::rc::Rc;

fn share(data: Vec<i32>, n: usize) -> Vec<Rc<Vec<i32>>> {
    todo!()
}

fn total(handles: &[Rc<Vec<i32>>]) -> i32 {
    todo!()
}
`,
  solutionCode: `use std::rc::Rc;

fn share(data: Vec<i32>, n: usize) -> Vec<Rc<Vec<i32>>> {
    let rc = Rc::new(data);
    (0..n).map(|_| Rc::clone(&rc)).collect()
}

fn total(handles: &[Rc<Vec<i32>>]) -> i32 {
    handles.iter().map(|h| h.iter().sum::<i32>()).sum()
}
`,
});
