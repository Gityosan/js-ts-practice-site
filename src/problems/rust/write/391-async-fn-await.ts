import { defineProblem } from "../../../core/schemas";

export default defineProblem({
  id: "rust-async-fn-chain",
  stage: "write",
  language: "rust",
  scenario: "rust",
  copy: {
    title: "async fn と .await を組み合わせる",
    prompt: `## やること

簡易ランタイム \`block_on\` は用意してある（前の問題で作ったもの）。次の 3 つの **async fn** を書こう。

| 関数 | 動き |
|---|---|
| \`async fn fetch_price(item: &str) -> Option<u32>\` | \`"apple"\` → \`Some(120)\`、\`"banana"\` → \`Some(80)\`、\`"melon"\` → \`Some(1500)\`、それ以外 → \`None\` |
| \`async fn total(items: Vec<&str>) -> Option<u32>\` | 各品目の値段を **順番に \`.await\`** して合計する。1 つでも \`None\` なら \`None\` |
| \`async fn total_text(items: Vec<&str>) -> String\` | \`total(...).await\` が \`Some(n)\` なら \`"合計 n 円"\`、\`None\` なら \`"不明な商品があります"\` |

## ポイント

- async fn の中では、他の async fn を \`.await\` で待てる
- \`?\` 演算子は async fn の中でも使える（\`fetch_price(i).await?\`）
- 採点は \`block_on(total(vec!["apple", "banana"]))\` のように行う`,
    hints: [
      '`match item { "apple" => Some(120), ... , _ => None }`',
      "`let mut sum = 0; for i in items { sum += fetch_price(i).await?; } Some(sum)`",
      '`match total(items).await { Some(n) => format!("合計 {n} 円"), None => ... }`',
    ],
  },
  initialCode: `use std::future::Future;
use std::pin::pin;
use std::task::{Context, Poll, Waker};

// 学習用の超簡易ランタイム: Future が Ready になるまで poll し続ける
fn block_on<F: Future>(fut: F) -> F::Output {
    let mut fut = pin!(fut);
    let mut cx = Context::from_waker(Waker::noop());
    loop {
        if let Poll::Ready(v) = fut.as_mut().poll(&mut cx) {
            return v;
        }
    }
}

async fn fetch_price(item: &str) -> Option<u32> {
    todo!()
}

async fn total(items: Vec<&str>) -> Option<u32> {
    todo!()
}

async fn total_text(items: Vec<&str>) -> String {
    todo!()
}
`,
  solutionCode: `use std::future::Future;
use std::pin::pin;
use std::task::{Context, Poll, Waker};

// 学習用の超簡易ランタイム: Future が Ready になるまで poll し続ける
fn block_on<F: Future>(fut: F) -> F::Output {
    let mut fut = pin!(fut);
    let mut cx = Context::from_waker(Waker::noop());
    loop {
        if let Poll::Ready(v) = fut.as_mut().poll(&mut cx) {
            return v;
        }
    }
}

async fn fetch_price(item: &str) -> Option<u32> {
    match item {
        "apple" => Some(120),
        "banana" => Some(80),
        "melon" => Some(1500),
        _ => None,
    }
}

async fn total(items: Vec<&str>) -> Option<u32> {
    let mut sum = 0;
    for item in items {
        sum += fetch_price(item).await?;
    }
    Some(sum)
}

async fn total_text(items: Vec<&str>) -> String {
    match total(items).await {
        Some(n) => format!("合計 {n} 円"),
        None => String::from("不明な商品があります"),
    }
}
`,
});
