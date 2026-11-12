import { defineProblem } from "../../../core/schemas";

export default defineProblem({
  id: "rust-thread-spawn-join",
  stage: "write",
  language: "rust",
  scenario: "rust",
  copy: {
    title: "thread::spawn と join で並列に計算する",
    prompt: `## やること

\`parallel_squares(v: Vec<i64>) -> Vec<i64>\` を書こう。要素ごとに **1 本ずつスレッドを作って** 2 乗を計算し、**元の順番で** 結果を集めて返す。

\`\`\`rust
parallel_squares(vec![1, 2, 3]) // => [1, 4, 9]
\`\`\`

## 手順

- \`thread::spawn(move || x * x)\` で、各要素についてスレッドを起動し、\`JoinHandle\` を \`Vec\` に集める
- 全部起動してから、\`handle.join().unwrap()\` で順番に結果を受け取る
- \`move\` を付けて \`x\` の所有権（コピー）をスレッドに渡すのを忘れずに

起動した順に join すれば、スレッドがどの順番で終わっても結果の順番は保たれる。`,
    hints: [
      "`let handles: Vec<_> = v.into_iter().map(|x| thread::spawn(move || x * x)).collect();`",
      "`handles.into_iter().map(|h| h.join().unwrap()).collect()`",
      "spawn と join を同じ map の中でやると 1 本ずつ順番に待つことになり、並列にならない",
    ],
  },
  initialCode: `use std::thread;

fn parallel_squares(v: Vec<i64>) -> Vec<i64> {
    todo!()
}
`,
  solutionCode: `use std::thread;

fn parallel_squares(v: Vec<i64>) -> Vec<i64> {
    let handles: Vec<thread::JoinHandle<i64>> = v
        .into_iter()
        .map(|x| thread::spawn(move || x * x))
        .collect();
    handles.into_iter().map(|h| h.join().unwrap()).collect()
}
`,
});
