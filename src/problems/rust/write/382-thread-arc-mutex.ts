import { defineProblem } from "../../../core/schemas";

export default defineProblem({
  id: "rust-thread-arc-mutex",
  stage: "write",
  language: "rust",
  scenario: "rust",
  copy: {
    title: "Arc<Mutex> で共有カウンタと共有リスト",
    prompt: `## やること

### 1. \`count_up(threads: usize, per_thread: usize) -> usize\`

\`Arc<Mutex<usize>>\` のカウンタを \`threads\` 本のスレッドで共有し、各スレッドが \`per_thread\` 回ずつ 1 を足す。全スレッドを join したあとの値を返す。

### 2. \`collect_ids(n: usize) -> Vec<usize>\`

\`Arc<Mutex<Vec<usize>>>\` を \`n\` 本のスレッドで共有し、スレッド \`i\`（0 始まり）が自分の番号 \`i\` を push する。最後に中身を **ソートして** 返す（push の順番は実行ごとに変わるため）。

## ヒント

- \`let c = Arc::clone(&counter);\` を **スレッドごとに** 作って \`move\` で渡す
- \`*c.lock().unwrap() += 1;\`
- 最後に取り出すには \`counter.lock().unwrap().clone()\` や \`*counter.lock().unwrap()\``,
    hints: [
      "`let counter = Arc::new(Mutex::new(0usize));`",
      "スレッドの中: `for _ in 0..per_thread { *c.lock().unwrap() += 1; }`",
      "Vec は `let mut v = list.lock().unwrap().clone(); v.sort(); v`",
    ],
  },
  initialCode: `use std::sync::{Arc, Mutex};
use std::thread;

fn count_up(threads: usize, per_thread: usize) -> usize {
    todo!()
}

fn collect_ids(n: usize) -> Vec<usize> {
    todo!()
}
`,
  solutionCode: `use std::sync::{Arc, Mutex};
use std::thread;

fn count_up(threads: usize, per_thread: usize) -> usize {
    let counter = Arc::new(Mutex::new(0usize));
    let mut handles = Vec::new();
    for _ in 0..threads {
        let c = Arc::clone(&counter);
        handles.push(thread::spawn(move || {
            for _ in 0..per_thread {
                *c.lock().unwrap() += 1;
            }
        }));
    }
    for h in handles {
        h.join().unwrap();
    }
    *counter.lock().unwrap()
}

fn collect_ids(n: usize) -> Vec<usize> {
    let list = Arc::new(Mutex::new(Vec::new()));
    let handles: Vec<_> = (0..n)
        .map(|i| {
            let l = Arc::clone(&list);
            thread::spawn(move || l.lock().unwrap().push(i))
        })
        .collect();
    for h in handles {
        h.join().unwrap();
    }
    let mut v = list.lock().unwrap().clone();
    v.sort();
    v
}
`,
});
