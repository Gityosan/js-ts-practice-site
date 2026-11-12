import { defineProblem } from "../../../core/schemas";

export default defineProblem({
  id: "rust-thread-atomic-counter",
  stage: "write",
  language: "rust",
  scenario: "rust",
  copy: {
    title: "アトミック型でロックなしのカウンタ",
    prompt: `## やること

\`count_even_parallel(data: Vec<u32>, threads: usize) -> usize\` を書こう。

- \`data\` を \`threads\` 個ほどの塊（chunk）に分け、各スレッドが自分の塊の中の **偶数の個数** を数える
- 数えた結果は **\`Arc<AtomicUsize>\`** に \`fetch_add\` で足し込む（Mutex は使わない）
- 全スレッドを join したあと、\`load\` した値を返す

塊の大きさは \`(data.len() + threads - 1) / threads\`（切り上げ）とし、0 になる場合は 1 にする。\`threads\` は 1 以上とする。

## ヒント

\`\`\`rust
use std::sync::atomic::{AtomicUsize, Ordering};
let count = Arc::new(AtomicUsize::new(0));
count.fetch_add(3, Ordering::SeqCst);
count.load(Ordering::SeqCst);
\`\`\`

\`data.chunks(size)\` は借用なので、そのままでは \`thread::spawn\` に渡せない。各塊を \`.to_vec()\` してから \`move\` で渡そう（または \`thread::scope\` を使ってもよい）。`,
    hints: [
      "`let size = ((data.len() + threads - 1) / threads).max(1);`",
      "`for chunk in data.chunks(size) { let chunk = chunk.to_vec(); let c = Arc::clone(&count); ... }`",
      "スレッドの中: `let n = chunk.iter().filter(|x| *x % 2 == 0).count(); c.fetch_add(n, Ordering::SeqCst);`",
    ],
  },
  initialCode: `use std::sync::atomic::{AtomicUsize, Ordering};
use std::sync::Arc;
use std::thread;

fn count_even_parallel(data: Vec<u32>, threads: usize) -> usize {
    todo!()
}
`,
  solutionCode: `use std::sync::atomic::{AtomicUsize, Ordering};
use std::sync::Arc;
use std::thread;

fn count_even_parallel(data: Vec<u32>, threads: usize) -> usize {
    let count = Arc::new(AtomicUsize::new(0));
    let size = ((data.len() + threads - 1) / threads).max(1);
    let mut handles = Vec::new();
    for chunk in data.chunks(size) {
        let chunk = chunk.to_vec();
        let c = Arc::clone(&count);
        handles.push(thread::spawn(move || {
            let n = chunk.iter().filter(|x| *x % 2 == 0).count();
            c.fetch_add(n, Ordering::SeqCst);
        }));
    }
    for h in handles {
        h.join().unwrap();
    }
    count.load(Ordering::SeqCst)
}
`,
});
