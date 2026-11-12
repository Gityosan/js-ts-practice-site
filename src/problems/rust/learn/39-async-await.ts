import { defineProblem } from "../../../core/schemas";

export default defineProblem({
  id: "rust-learn-async-await",
  stage: "learn",
  language: "rust",
  scenario: "rust",
  copy: {
    title: "async / await と Future",
    prompt: `## async は何のためにあるのか

Web サーバーが 1 万件の接続を同時に扱う場面を考える。各接続はほとんどの時間を **ネットワークの待ち** に使う。1 接続に 1 スレッドを割り当てると、スレッド 1 本あたり数 MB のスタックと OS の切り替えコストがかかり、すぐに限界が来る。

**async / await** は「待っている間は他の仕事をする」を、少ないスレッドで効率よく実現する仕組み。

## 並行（concurrency）と並列（parallelism）

| 用語 | 意味 | たとえ |
|---|---|---|
| 並行 | 複数の仕事を **切り替えながら** 進める | 1 人の料理人が、湯を沸かす間に野菜を切る |
| 並列 | 複数の仕事を **同時に** 実行する | 料理人が 2 人いて、それぞれ別の料理を作る |

- **スレッド** は並列（CPU コアが複数あれば本当に同時に動く）
- **async** は主に並行（待ち時間を有効活用する）。マルチスレッドのランタイムを使えば並列にもなる

## Future トレイト

Rust の async の中心は \`std::future::Future\` トレイト。「**いつか値ができあがる計算**」を表す。

\`\`\`rust
pub trait Future {
    type Output;
    fn poll(self: Pin<&mut Self>, cx: &mut Context<'_>) -> Poll<Self::Output>;
}

pub enum Poll<T> {
    Ready(T),  // できあがった
    Pending,   // まだ。準備ができたら cx の Waker で知らせる
}
\`\`\`

- \`poll\` を呼ぶと、Future は進められるところまで進み、完了していれば \`Ready(値)\`、待ちが必要なら \`Pending\` を返す
- \`Pending\` を返すときは「準備ができたら起こしてね」という **Waker** を登録しておく。I/O が終わると Waker が呼ばれ、ランタイムがもう一度 \`poll\` する
- \`Pin\` は「この値はメモリ上で動かさない」という約束。async fn が作る Future は自分の中への参照を持つことがあるので、動かされると困る

## async fn と .await

\`\`\`rust
async fn fetch_number() -> u32 {
    42
}

async fn run() -> u32 {
    let a = fetch_number().await; // 完了するまで待つ（スレッドはブロックしない）
    let b = fetch_number().await;
    a + b
}
\`\`\`

- \`async fn f() -> T\` は、実際には **\`impl Future<Output = T>\` を返す関数** になる
- **呼んだだけでは何も実行されない**（遅延評価）。\`.await\` するか、ランタイムに渡して初めて動く。JS の Promise は作った瞬間に動き出すので、ここが大きな違い
- \`.await\` は async fn / async ブロックの中でしか使えない
- \`async { ... }\` ブロックでもその場で Future を作れる。\`async move { ... }\` で変数の所有権を取り込む

\`\`\`rust
let fut = async {
    let x = fetch_number().await;
    x * 2
};
// この時点ではまだ何も実行されていない
\`\`\`

## async fn は「状態機械」にコンパイルされる

コンパイラは async fn を、\`.await\` の位置で区切った **enum の状態機械** に変換する。

\`\`\`text
状態0: 開始 → fetch_number() を poll → Pending なら状態0のまま戻る
状態1: a を保存して 2 つ目を poll → Pending なら状態1のまま戻る
状態2: a + b を Ready で返す
\`\`\`

そのため async はスレッドのような独自のスタックを持たず、**必要な変数だけを保存する小さな値** になる。何万個作っても軽い。これが **ゼロコスト抽象化** と呼ばれる理由。

## なぜランタイム（tokio など）が必要か

Rust の標準ライブラリには **Future を実行する仕組み（エグゼキュータ）が入っていない**。\`fn main\` を \`async fn main\` にすることもそのままではできない。

理由は、用途によって最適なランタイムが違うから（Web サーバー向け、組み込み向け、シングルスレッド向けなど）。言語は Future の「形」だけを決め、実行役はライブラリに任せている。

| ランタイム | 特徴 |
|---|---|
| tokio | 最も広く使われる。マルチスレッド、ネットワーク・タイマー・ファイルなどの非同期 I/O 付き |
| async-std | 標準ライブラリに似た API |
| smol | 小さくシンプル |
| embassy | 組み込み向け |

\`\`\`rust
// Cargo.toml に tokio = { version = "1", features = ["full"] } を追加した場合
#[tokio::main]
async fn main() {
    let (a, b) = tokio::join!(task_a(), task_b()); // 2 つを並行に待つ
    let h = tokio::spawn(async { 1 + 1 });         // 軽量タスクを起動
    let v = h.await.unwrap();
    tokio::time::sleep(std::time::Duration::from_millis(100)).await;
}
\`\`\`

ランタイムがやっていることは、ざっくり次の通り。

- 実行待ちのタスク（Future）のキューを持ち、順に \`poll\` する
- \`Pending\` になったタスクは脇に置き、OS の I/O 通知（epoll / kqueue など）を待つ
- 準備ができたら Waker 経由でタスクをキューに戻し、また \`poll\` する

## 自分で poll してみる（簡易 block_on）

仕組みを理解するために、std だけで「完了するまで poll し続ける」最小のエグゼキュータを書ける。Rust 1.85 で何もしない Waker \`Waker::noop()\` が安定化された。

\`\`\`rust
use std::future::Future;
use std::pin::pin;
use std::task::{Context, Poll, Waker};

fn block_on<F: Future>(fut: F) -> F::Output {
    let mut fut = pin!(fut);                         // Future をスタック上に固定
    let mut cx = Context::from_waker(Waker::noop()); // 何もしない Waker
    loop {
        match fut.as_mut().poll(&mut cx) {
            Poll::Ready(v) => return v,
            Poll::Pending => {} // 本物のランタイムはここで眠って通知を待つ
        }
    }
}

async fn add(a: i32, b: i32) -> i32 { a + b }

fn main() {
    let v = block_on(async { add(1, 2).await * 10 });
    println!("{v}"); // 30
}
\`\`\`

本物のランタイムは \`Pending\` のときに CPU を回し続けず、Waker で起こされるまで眠る。この簡易版は学習用（ビジーループ）。

## Future を手で実装する

\`\`\`rust
struct Countdown(u32);

impl Future for Countdown {
    type Output = &'static str;
    fn poll(mut self: Pin<&mut Self>, cx: &mut Context<'_>) -> Poll<Self::Output> {
        if self.0 == 0 {
            Poll::Ready("発射！")
        } else {
            self.0 -= 1;
            cx.waker().wake_by_ref(); // 「すぐまた poll して」と知らせる
            Poll::Pending
        }
    }
}
\`\`\`

\`Countdown(3).await\` は 3 回 \`Pending\` を返したあと、4 回目の poll で \`Ready\` になる。

## async の注意点

- **async の中でブロックする処理を呼ばない**。\`std::thread::sleep\` や重い計算をすると、そのスレッド上の他のタスクが全部止まる。\`tokio::time::sleep\` や \`spawn_blocking\` を使う
- **\`.await\` を忘れると何も起きない**。コンパイラが「unused future」の警告を出してくれる
- 複数スレッドで動くランタイムでは、タスクが \`Send\` である必要がある（\`.await\` をまたいで \`Rc\` を持っているとエラー）
- 関数に色が付く問題: async fn は async な文脈からしか \`.await\` できない。同期コードから呼ぶにはランタイムの \`block_on\` が必要

## スレッドと async の使い分け

| 状況 | 向いているもの |
|---|---|
| CPU をたくさん使う計算（画像処理、数値計算） | スレッド（\`thread::spawn\` / \`scope\`、rayon など） |
| ネットワーク・ファイルなど I/O 待ちが多い | async |
| 同時接続が数千〜数万 | async |
| 数本の独立した作業、シンプルさ優先 | スレッド |
| async の中で重い計算をしたい | \`spawn_blocking\` などで別スレッドへ逃がす |

スレッドは「OS が切り替える、重いが単純」、async は「プログラムが切り替える、軽いが仕組みが複雑」と覚えるとよい。`,
    hints: [
      "`async fn` は `impl Future` を返す。呼んだだけでは実行されず、`.await` かランタイムで動く。",
      "`Future::poll` は `Poll::Ready(値)` か `Poll::Pending` を返す。Pending のときは Waker で起こしてもらう。",
      "std には実行役（エグゼキュータ）が無いので、tokio などのランタイムを使う。",
      "CPU を使う計算はスレッド、I/O 待ちが多い処理は async が向いている。",
    ],
  },
  learn: {
    quiz: [
      {
        prompt: '次のコードで `"呼ばれた"` は表示される？',
        snippet: `async fn hello() { println!("呼ばれた"); }

fn main() {
    let _f = hello();
}`,
        choices: [
          "表示されない（Future を作っただけで実行していない）",
          "表示される",
          "コンパイルエラーになる",
          "実行時に panic する",
        ],
        answer: "表示されない（Future を作っただけで実行していない）",
        explain:
          "Rust の Future は遅延評価。await やランタイムで poll されるまで中身は動かない（JS の Promise との違い）。",
      },
      {
        prompt: "`Future::poll` の戻り値の型は？",
        choices: [
          "Poll<Self::Output>",
          "Option<Self::Output>",
          "Result<Self::Output, Pending>",
          "bool",
        ],
        answer: "Poll<Self::Output>",
        explain: "`Poll::Ready(v)` か `Poll::Pending` を返す。",
      },
      {
        prompt: "Rust で tokio などのランタイムが必要な理由は？",
        choices: [
          "標準ライブラリに Future を実行するエグゼキュータが含まれていないから",
          "async 構文が標準ではないから",
          "Future トレイトが外部クレートにあるから",
          "コンパイラが async を理解しないから",
        ],
        answer: "標準ライブラリに Future を実行するエグゼキュータが含まれていないから",
        explain:
          "言語は Future の形と async/await 構文だけを提供し、実行役は用途に合わせてライブラリが担う。",
      },
      {
        prompt: "「1 人の料理人が湯を沸かす間に野菜を切る」のはどちら？",
        choices: ["並行", "並列", "直列", "逐次"],
        answer: "並行",
        explain: "複数の仕事を切り替えながら進めるのが並行。同時に実行するのが並列。",
      },
      {
        prompt: "async の中で避けるべきことは？",
        choices: [
          "std::thread::sleep のようにスレッドをブロックする処理を呼ぶ",
          ".await を使う",
          "async ブロックを作る",
          "別の async fn を呼ぶ",
        ],
        answer: "std::thread::sleep のようにスレッドをブロックする処理を呼ぶ",
        explain:
          "ブロックするとそのスレッドで動く他のタスクも止まる。ランタイムの非同期 sleep を使う。",
      },
      {
        prompt: "画像の大量変換（CPU をフルに使う処理）に向いているのは？",
        choices: ["スレッド", "async だけ", "どちらも使えない", "チャネルだけ"],
        answer: "スレッド",
        explain:
          "CPU バウンドな処理は待ち時間がないので、複数コアで並列に動くスレッドが向いている。",
      },
      {
        prompt: "`async fn f() -> u32` の本当の戻り値の型は？",
        choices: ["impl Future<Output = u32>", "u32", "Poll<u32>", "Result<u32, ()>"],
        answer: "impl Future<Output = u32>",
        explain: "async fn は Future を返す関数の糖衣構文。`.await` すると u32 が取り出せる。",
      },
    ],
  },
});
