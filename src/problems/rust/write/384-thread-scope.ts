import { defineProblem } from "../../../core/schemas";

export default defineProblem({
  id: "rust-thread-scoped-sum",
  stage: "write",
  language: "rust",
  scenario: "rust",
  copy: {
    title: "thread::scope で借用したまま並列処理",
    prompt: `## やること

\`thread::scope\` を使って、次の 2 つの関数を書こう。どちらも \`Arc\` や \`.to_vec()\` によるコピーは使わない。

### 1. \`parallel_sum(data: &[i64], parts: usize) -> i64\`

\`data\` を \`parts\` 個ほどの塊に分け（塊の大きさは切り上げ、最低 1）、各塊の合計をスレッドで計算して、全体の合計を返す。

### 2. \`double_in_place(data: &mut [i32], parts: usize)\`

\`chunks_mut\` で可変スライスを重ならないように分割し、各スレッドが自分の塊の要素を **2 倍に書き換える**。

\`\`\`rust
thread::scope(|s| {
    for chunk in data.chunks_mut(size) {
        s.spawn(move || { /* chunk を書き換える */ });
    }
});
\`\`\`

\`thread::scope\` はスコープの終わりで全スレッドの終了を待つので、\`data\` を借用したまま渡せる。`,
    hints: [
      "`let size = ((data.len() + parts - 1) / parts).max(1);`",
      "合計: `let hs: Vec<_> = data.chunks(size).map(|c| s.spawn(move || c.iter().sum::<i64>())).collect(); hs.into_iter().map(|h| h.join().unwrap()).sum()`",
      "書き換え: `for x in chunk.iter_mut() { *x *= 2; }`",
    ],
  },
  initialCode: `use std::thread;

fn parallel_sum(data: &[i64], parts: usize) -> i64 {
    todo!()
}

fn double_in_place(data: &mut [i32], parts: usize) {
    todo!()
}
`,
  solutionCode: `use std::thread;

fn parallel_sum(data: &[i64], parts: usize) -> i64 {
    let size = ((data.len() + parts - 1) / parts).max(1);
    thread::scope(|s| {
        let handles: Vec<_> = data
            .chunks(size)
            .map(|c| s.spawn(move || c.iter().sum::<i64>()))
            .collect();
        handles.into_iter().map(|h| h.join().unwrap()).sum()
    })
}

fn double_in_place(data: &mut [i32], parts: usize) {
    let size = ((data.len() + parts - 1) / parts).max(1);
    thread::scope(|s| {
        for chunk in data.chunks_mut(size) {
            s.spawn(move || {
                for x in chunk.iter_mut() {
                    *x *= 2;
                }
            });
        }
    });
}
`,
});
