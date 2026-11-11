import { defineProblem } from "../../../core/schemas";

export default defineProblem({
  id: "rust-stdlib-binaryheap-reverse",
  stage: "write",
  language: "rust",
  scenario: "rust",
  copy: {
    title: "BinaryHeap と Reverse で上位 K 件・タスク処理",
    prompt: `## やること

### 1. \`top_k(v: &[i32], k: usize) -> Vec<i32>\`

大きい順に上位 \`k\` 件を返す（\`k\` が要素数より多ければ全部）。\`BinaryHeap\` に全部入れて \`pop\` を \`k\` 回すればよい。

### 2. \`k_smallest(v: &[i32], k: usize) -> Vec<i32>\`

小さい順に \`k\` 件を返す。\`Reverse\` で包んで **最小ヒープ** にする。

### 3. \`process_tasks(tasks: &[(u32, &str)]) -> Vec<String>\`

\`(優先度, 名前)\` のタスクを、**優先度の高い順** に処理した名前の列を返す。同じ優先度なら **名前の辞書順（昇順）** にする。

\`\`\`rust
process_tasks(&[(1, "wash"), (3, "deploy"), (3, "build"), (2, "test")])
// => ["build", "deploy", "test", "wash"]
\`\`\`

ヒント: \`(優先度, Reverse(名前))\` をヒープに入れると、優先度は大きい順、名前は小さい順に出てくる。`,
    hints: [
      "`let mut heap: BinaryHeap<i32> = v.iter().copied().collect();` → `while out.len() < k { match heap.pop() { Some(x) => out.push(x), None => break } }`",
      "`let mut heap: BinaryHeap<Reverse<i32>> = v.iter().map(|&x| Reverse(x)).collect();` と `if let Some(Reverse(x)) = heap.pop()`",
      "タスク: `heap.push((p, Reverse(name.to_string())))` → `while let Some((_, Reverse(name))) = heap.pop()`",
    ],
  },
  initialCode: `use std::cmp::Reverse;
use std::collections::BinaryHeap;

fn top_k(v: &[i32], k: usize) -> Vec<i32> {
    todo!()
}

fn k_smallest(v: &[i32], k: usize) -> Vec<i32> {
    todo!()
}

fn process_tasks(tasks: &[(u32, &str)]) -> Vec<String> {
    todo!()
}
`,
  solutionCode: `use std::cmp::Reverse;
use std::collections::BinaryHeap;

fn top_k(v: &[i32], k: usize) -> Vec<i32> {
    let mut heap: BinaryHeap<i32> = v.iter().copied().collect();
    let mut out = Vec::new();
    while out.len() < k {
        match heap.pop() {
            Some(x) => out.push(x),
            None => break,
        }
    }
    out
}

fn k_smallest(v: &[i32], k: usize) -> Vec<i32> {
    let mut heap: BinaryHeap<Reverse<i32>> = v.iter().map(|&x| Reverse(x)).collect();
    let mut out = Vec::new();
    while out.len() < k {
        match heap.pop() {
            Some(Reverse(x)) => out.push(x),
            None => break,
        }
    }
    out
}

fn process_tasks(tasks: &[(u32, &str)]) -> Vec<String> {
    let mut heap = BinaryHeap::new();
    for &(p, name) in tasks {
        heap.push((p, Reverse(name.to_string())));
    }
    let mut out = Vec::new();
    while let Some((_, Reverse(name))) = heap.pop() {
        out.push(name);
    }
    out
}
`,
});
