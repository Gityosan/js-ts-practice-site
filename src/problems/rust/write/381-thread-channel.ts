import { defineProblem } from "../../../core/schemas";

export default defineProblem({
  id: "rust-thread-mpsc-channel",
  stage: "write",
  language: "rust",
  scenario: "rust",
  copy: {
    title: "チャネルで複数のワーカーから結果を集める",
    prompt: `## やること

\`sum_by_workers(chunks: Vec<Vec<i32>>) -> (i32, usize)\` を書こう。

- \`chunks\` の 1 つ 1 つを担当する **ワーカースレッド** を起動する
- 各ワーカーは自分の担当の合計を計算し、**チャネル** で送る
- メインスレッドは受け取った値をすべて足し、\`(総合計, 受け取ったメッセージ数)\` を返す

\`\`\`rust
sum_by_workers(vec![vec![1, 2], vec![3], vec![4, 5, 6]]) // => (21, 3)
\`\`\`

## ポイント

- \`let (tx, rx) = mpsc::channel();\`
- ワーカーごとに \`let tx = tx.clone();\` してから \`move\` クロージャに渡す
- ループの後で **元の \`tx\` を \`drop(tx)\`** しないと、\`for v in rx\` が終わらない`,
    hints: [
      "`for chunk in chunks { let tx = tx.clone(); thread::spawn(move || { tx.send(chunk.iter().sum::<i32>()).unwrap(); }); }`",
      "`drop(tx);` を忘れると受信側が永遠に待つ",
      "`for v in rx { total += v; count += 1; }`",
    ],
  },
  initialCode: `use std::sync::mpsc;
use std::thread;

fn sum_by_workers(chunks: Vec<Vec<i32>>) -> (i32, usize) {
    let (tx, rx) = mpsc::channel::<i32>();
    todo!()
}
`,
  solutionCode: `use std::sync::mpsc;
use std::thread;

fn sum_by_workers(chunks: Vec<Vec<i32>>) -> (i32, usize) {
    let (tx, rx) = mpsc::channel::<i32>();
    for chunk in chunks {
        let tx = tx.clone();
        thread::spawn(move || {
            tx.send(chunk.iter().sum()).unwrap();
        });
    }
    drop(tx);
    let mut total = 0;
    let mut count = 0;
    for v in rx {
        total += v;
        count += 1;
    }
    (total, count)
}
`,
});
