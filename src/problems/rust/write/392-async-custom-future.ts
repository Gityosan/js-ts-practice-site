import { defineProblem } from "../../../core/schemas";

export default defineProblem({
  id: "rust-async-impl-future",
  stage: "write",
  language: "rust",
  scenario: "rust",
  copy: {
    title: "Future トレイトを手で実装する",
    prompt: `## やること

\`poll\` されるたびに残り回数を 1 減らし、0 になったら完了する Future \`Countdown\` を実装しよう。

- \`Countdown { remaining: n }\` は、最初の \`n\` 回の \`poll\` では \`remaining\` を 1 減らし、\`cx.waker().wake_by_ref()\` を呼んでから \`Poll::Pending\` を返す
- \`remaining\` が 0 のときに poll されたら \`Poll::Ready(完了メッセージ)\` を返す。メッセージは \`format!("{}回待った", 待った回数)\`（\`Countdown\` に \`waited\` フィールドを持たせて数える）

用意してある \`run_counting\` は、Future を完了まで poll して \`(結果, poll した回数)\` を返す。\`Countdown { remaining: 3, waited: 0 }\` なら \`("3回待った", 4)\` になる（Pending 3 回 + Ready 1 回）。

\`\`\`rust
impl Future for Countdown {
    type Output = String;
    fn poll(mut self: Pin<&mut Self>, cx: &mut Context<'_>) -> Poll<String> {
        // self.remaining などはそのまま読み書きできる（Countdown は Unpin なので）
    }
}
\`\`\`

完成した \`Countdown\` は普通に \`.await\` もできる。`,
    hints: [
      '`if self.remaining == 0 { return Poll::Ready(format!("{}回待った", self.waited)); }`',
      "`self.remaining -= 1; self.waited += 1; cx.waker().wake_by_ref(); Poll::Pending`",
      "`mut self: Pin<&mut Self>` と書くと self を変更できる",
    ],
  },
  initialCode: `use std::future::Future;
use std::pin::{pin, Pin};
use std::task::{Context, Poll, Waker};

struct Countdown {
    remaining: u32,
    waited: u32,
}

impl Future for Countdown {
    type Output = String;

    fn poll(mut self: Pin<&mut Self>, cx: &mut Context<'_>) -> Poll<String> {
        todo!()
    }
}

// Future を完了まで poll し、(結果, poll した回数) を返す
fn run_counting<F: Future>(fut: F) -> (F::Output, u32) {
    let mut fut = pin!(fut);
    let mut cx = Context::from_waker(Waker::noop());
    let mut polls = 0;
    loop {
        polls += 1;
        if let Poll::Ready(v) = fut.as_mut().poll(&mut cx) {
            return (v, polls);
        }
    }
}
`,
  solutionCode: `use std::future::Future;
use std::pin::{pin, Pin};
use std::task::{Context, Poll, Waker};

struct Countdown {
    remaining: u32,
    waited: u32,
}

impl Future for Countdown {
    type Output = String;

    fn poll(mut self: Pin<&mut Self>, cx: &mut Context<'_>) -> Poll<String> {
        if self.remaining == 0 {
            return Poll::Ready(format!("{}回待った", self.waited));
        }
        self.remaining -= 1;
        self.waited += 1;
        cx.waker().wake_by_ref();
        Poll::Pending
    }
}

// Future を完了まで poll し、(結果, poll した回数) を返す
fn run_counting<F: Future>(fut: F) -> (F::Output, u32) {
    let mut fut = pin!(fut);
    let mut cx = Context::from_waker(Waker::noop());
    let mut polls = 0;
    loop {
        polls += 1;
        if let Poll::Ready(v) = fut.as_mut().poll(&mut cx) {
            return (v, polls);
        }
    }
}
`,
});
