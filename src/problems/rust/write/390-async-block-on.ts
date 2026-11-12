import { defineProblem } from "../../../core/schemas";

export default defineProblem({
  id: "rust-async-block-on",
  stage: "write",
  language: "rust",
  scenario: "rust",
  copy: {
    title: "Future を手で poll する block_on を作る",
    prompt: `## やること

標準ライブラリだけで、Future を最後まで実行する **簡易エグゼキュータ** \`block_on\` を書こう。

\`\`\`rust
fn block_on<F: Future>(fut: F) -> F::Output
\`\`\`

## 手順

- \`let mut fut = pin!(fut);\` で Future をスタック上に固定する（\`poll\` には \`Pin<&mut F>\` が必要）
- \`let mut cx = Context::from_waker(Waker::noop());\` で何もしない Waker からコンテキストを作る（Rust 1.85 で安定化）
- \`loop\` の中で \`fut.as_mut().poll(&mut cx)\` を呼び、\`Poll::Ready(v)\` なら \`v\` を返す。\`Poll::Pending\` ならもう一度 poll する

採点では \`block_on(async { 1 + 2 })\` や、\`async fn\` を組み合わせた Future を実行する。`,
    hints: [
      "`let mut fut = pin!(fut);`",
      "`match fut.as_mut().poll(&mut cx) { Poll::Ready(v) => return v, Poll::Pending => {} }`",
      "`as_mut()` で `Pin<&mut F>` を毎回借り直す",
    ],
  },
  initialCode: `use std::future::Future;
use std::pin::pin;
use std::task::{Context, Poll, Waker};

fn block_on<F: Future>(fut: F) -> F::Output {
    todo!()
}

async fn add(a: i32, b: i32) -> i32 {
    a + b
}
`,
  solutionCode: `use std::future::Future;
use std::pin::pin;
use std::task::{Context, Poll, Waker};

fn block_on<F: Future>(fut: F) -> F::Output {
    let mut fut = pin!(fut);
    let mut cx = Context::from_waker(Waker::noop());
    loop {
        match fut.as_mut().poll(&mut cx) {
            Poll::Ready(v) => return v,
            Poll::Pending => {}
        }
    }
}

async fn add(a: i32, b: i32) -> i32 {
    a + b
}
`,
});
