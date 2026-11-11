import { defineProblem } from "../../../core/schemas";

export default defineProblem({
  id: "rust-learn-concurrency",
  stage: "learn",
  language: "rust",
  scenario: "rust",
  copy: {
    title: "並行処理（thread / チャネル / Mutex / Arc）",
    prompt: `## なぜ並行処理は難しいのか

複数のスレッドが同じデータを同時に読み書きすると、**データ競合（data race）** が起きる。結果が実行のたびに変わる、たまにだけ壊れる、という最悪の種類のバグになる。

多くの言語はこれを「プログラマが気をつける」ことで防ぐが、Rust は **所有権と型システムでデータ競合をコンパイルエラーにする**。これを Rust では **Fearless Concurrency（怖くない並行処理）** と呼ぶ。

| 言語 | データ競合への対策 |
|---|---|
| C / C++ | プログラマの注意。間違えると未定義動作 |
| Java / Go | 実行時の道具（synchronized, mutex, race detector）。忘れても動いてしまう |
| JavaScript | そもそもメインスレッドは 1 本（Worker はメモリを共有しない） |
| Rust | 共有のルールを型で表し、守っていないとコンパイルが通らない |

## thread::spawn と join

\`\`\`rust
use std::thread;
use std::time::Duration;

fn main() {
    let handle = thread::spawn(|| {
        for i in 1..=3 {
            println!("子スレッド: {i}");
            thread::sleep(Duration::from_millis(10));
        }
        42 // スレッドの戻り値
    });

    println!("メインスレッドは先に進む");
    let result = handle.join().unwrap(); // 子スレッドの終了を待つ
    println!("子の結果: {result}");
}
\`\`\`

- \`thread::spawn(クロージャ)\` で新しい OS スレッドを作り、\`JoinHandle<T>\` が返る
- \`handle.join()\` で終了を待ち、\`Result<T, _>\` を受け取る。子スレッドが panic していたら \`Err\`
- **main が終わるとプロセスごと終了** し、終わっていない子スレッドも強制終了する。だから \`join\` で待つ
- 表示の順番は実行ごとに変わりうる（OS がスケジュールを決める）

## move クロージャ

子スレッドはいつまで生きるか分からない。だから外の変数を **借用** するクロージャは渡せない。

\`\`\`rust
use std::thread;

fn main() {
    let v = vec![1, 2, 3];
    // let h = thread::spawn(|| println!("{:?}", v)); // E0373: v が先に破棄されるかも
    let h = thread::spawn(move || {
        println!("{:?}", v); // v の所有権ごとスレッドに移す
    });
    h.join().unwrap();
    // println!("{:?}", v); // E0382: v はもう移動済み
}
\`\`\`

\`thread::spawn\` のクロージャには \`'static\` 境界がある（＝借用を含まず、いつまでも生きられる値しか持てない）。\`move\` を付けて **所有権ごと渡す** のが基本。

## チャネル（mpsc）でメッセージを送る

「メモリを共有して通信するな、通信してメモリを共有せよ」という考え方。\`std::sync::mpsc\` は **multiple producer, single consumer**（送信者は複数、受信者は 1 つ）のチャネル。

\`\`\`rust
use std::sync::mpsc;
use std::thread;

fn main() {
    let (tx, rx) = mpsc::channel();

    for id in 0..3 {
        let tx = tx.clone(); // 送信者は clone で増やせる
        thread::spawn(move || {
            tx.send(id * 10).unwrap(); // 値の所有権が受信側へ移る
        });
    }
    drop(tx); // 元の tx を捨てないと、受信ループが終わらない

    for received in rx {   // すべての送信者が drop されるとループ終了
        println!("受信: {received}");
    }
}
\`\`\`

| メソッド | 動き |
|---|---|
| \`tx.send(v)\` | 値を送る。受信者がいなければ \`Err\` |
| \`rx.recv()\` | 1 件届くまで待つ。送信者が全員いなくなると \`Err\` |
| \`rx.try_recv()\` | 待たずに確認。無ければすぐ \`Err\` |
| \`for v in rx\` / \`rx.iter()\` | 全送信者が drop されるまで受け取り続ける |

- \`send\` した値は **move** される。送った後に送信側で使うとコンパイルエラーになるので、「送ったデータを両方で触る」バグが起きない
- 受信ループを終わらせるには **すべての \`tx\` を drop** する必要がある（よくあるハマりどころ）

## Mutex で共有データを守る

\`Mutex<T>\`（mutual exclusion）は「同時に 1 スレッドだけ中身に触れる」箱。

\`\`\`rust
use std::sync::Mutex;

let m = Mutex::new(5);
{
    let mut num = m.lock().unwrap(); // ロックを取る（MutexGuard が返る）
    *num += 1;
} // guard がスコープを抜けると自動でロック解除
println!("{:?}", m.lock().unwrap()); // 6
\`\`\`

- \`lock()\` は \`LockResult<MutexGuard<T>>\`。ロック中に別スレッドが panic していると \`Err\`（poison）になるので、普通は \`unwrap()\`
- **ロック解除を書き忘れることがない**。guard が drop されたときに解除される（RAII）
- Rust の Mutex は **データを中に持つ**。ロックを取らないとデータに触れない構造なので、「ロックし忘れてアクセス」がそもそも書けない

## Arc で所有者を複数にする

Mutex を複数スレッドで共有するには、所有者を複数にする必要がある。\`Rc\` はスレッド間で使えない（参照カウントの更新がアトミックでない）ので、**\`Arc\`（Atomically Reference Counted）** を使う。

\`\`\`rust
use std::sync::{Arc, Mutex};
use std::thread;

fn main() {
    let counter = Arc::new(Mutex::new(0));
    let mut handles = vec![];

    for _ in 0..10 {
        let counter = Arc::clone(&counter); // カウントを増やすだけ（中身はコピーしない）
        handles.push(thread::spawn(move || {
            let mut n = counter.lock().unwrap();
            *n += 1;
        }));
    }
    for h in handles {
        h.join().unwrap();
    }
    println!("結果: {}", *counter.lock().unwrap()); // 10
}
\`\`\`

| 型 | 用途 | スレッド間 |
|---|---|---|
| \`Rc<T>\` | 単一スレッドで所有者を複数に | 不可 |
| \`Arc<T>\` | 複数スレッドで所有者を複数に | 可 |
| \`RefCell<T>\` | 単一スレッドで内部可変性 | 不可 |
| \`Mutex<T>\` / \`RwLock<T>\` | 複数スレッドで内部可変性 | 可 |

\`Arc<Mutex<T>>\` は「スレッド版の \`Rc<RefCell<T>>\`」と覚えるとよい。

## RwLock: 読む人が多いとき

\`RwLock<T>\` は「読むだけなら何人でも同時に」「書くときは 1 人だけ」のロック。

\`\`\`rust
use std::sync::RwLock;

let config = RwLock::new(String::from("v1"));
{
    let r1 = config.read().unwrap();
    let r2 = config.read().unwrap(); // 読み取りは同時に複数 OK
    println!("{r1} {r2}");
}
{
    let mut w = config.write().unwrap(); // 書き込みは排他
    w.push_str("-updated");
}
\`\`\`

借用ルール（\`&\` は何個でも、\`&mut\` は 1 つだけ）を実行時に行うものだと考えると分かりやすい。

## アトミック型

整数やフラグ 1 つを共有するだけなら、ロックなしで安全に操作できる **アトミック型** が速い。

\`\`\`rust
use std::sync::atomic::{AtomicUsize, Ordering};
use std::sync::Arc;
use std::thread;

fn main() {
    let count = Arc::new(AtomicUsize::new(0));
    let hs: Vec<_> = (0..4).map(|_| {
        let c = Arc::clone(&count);
        thread::spawn(move || {
            for _ in 0..1000 {
                c.fetch_add(1, Ordering::SeqCst); // 読んで足して書く、を不可分に行う
            }
        })
    }).collect();
    for h in hs { h.join().unwrap(); }
    println!("{}", count.load(Ordering::SeqCst)); // 4000
}
\`\`\`

- \`AtomicBool\`, \`AtomicI32\`, \`AtomicUsize\` など。\`load\` / \`store\` / \`fetch_add\` / \`compare_exchange\` など
- \`Ordering\` はメモリ順序の指定。迷ったら最も強い **\`SeqCst\`**、単純なカウンタなら \`Relaxed\` でもよい
- アトミック型は \`&self\` で変更できるので、\`static\` に置いてグローバルカウンタにもできる

## スコープ付きスレッド thread::scope

\`thread::scope\` を使うと、**スコープを抜ける前に全スレッドが必ず終わる** ことが保証される。だから外の変数を **借用したまま** スレッドに渡せる（\`move\` も \`Arc\` も要らない）。

\`\`\`rust
use std::thread;

fn main() {
    let data = vec![1, 2, 3, 4, 5, 6];
    let (left, right) = data.split_at(3);
    let mut total = 0;

    thread::scope(|s| {
        let h1 = s.spawn(|| left.iter().sum::<i32>());
        let h2 = s.spawn(|| right.iter().sum::<i32>());
        total = h1.join().unwrap() + h2.join().unwrap();
    }); // ここで全スレッドの終了が保証される

    println!("{total} {:?}", data); // 21 [1, 2, 3, 4, 5, 6]（data はまだ使える）
}
\`\`\`

- 読み取りだけなら複数スレッドに \`&data\` を配れる
- \`chunks_mut\` で可変スライスを分割すれば、**重ならない部分** をそれぞれのスレッドで書き換えられる

## Send と Sync: データ競合を防ぐ仕組み

Rust がデータ競合をコンパイル時に防げるのは、2 つの **マーカートレイト** のおかげ。

| トレイト | 意味 | 実装していない例 |
|---|---|---|
| \`Send\` | 値の **所有権を別スレッドに移して** よい | \`Rc<T>\`（カウントが非アトミック） |
| \`Sync\` | **\`&T\` を複数スレッドで共有して** よい（\`&T\` が Send） | \`RefCell<T>\`, \`Cell<T>\` |

- ほとんどの型は自動で \`Send + Sync\` になる（構成要素がすべてそうなら自動実装）
- \`thread::spawn\` は「クロージャとその戻り値が \`Send + 'static\`」を要求する
- だから \`Rc\` をスレッドに渡そうとすると **E0277: \`Rc<..>\` cannot be sent between threads safely** というコンパイルエラーになる

\`\`\`rust
use std::rc::Rc;
use std::thread;

let rc = Rc::new(5);
// thread::spawn(move || println!("{rc}")); // E0277: Rc は Send でない → Arc を使う
\`\`\`

まとめると、Rust のデータ競合防止は次のルールの組み合わせ。

- 可変参照 \`&mut\` は同時に 1 つだけ（借用ルール）。2 スレッドから同時に書けない
- スレッドに渡すものは \`Send\` が必要。危険な型は渡せない
- 共有して変更したいなら \`Mutex\` などで包むしかなく、ロックを取らないと中身に触れない

※ ただしデッドロック（2 つのロックをお互いに待つ）やロジックの競合（順番の思い込み）は防げない。それは設計で避ける。

## 使い分けの目安

- 独立した計算を並列に → \`thread::spawn\` + \`join\`、借用したいなら \`thread::scope\`
- 結果を集める・仕事を流す → \`mpsc\` チャネル
- 共有状態を変更 → \`Arc<Mutex<T>>\`（読む人が多ければ \`Arc<RwLock<T>>\`）
- カウンタやフラグ 1 つ → アトミック型
- 大量の I/O 待ち → スレッドより async（次の章）`,
    hints: [
      "`thread::spawn(move || ...)` でスレッドを作り、`join()` で終了を待つ。",
      "共有して書き換えるなら `Arc<Mutex<T>>`。`Rc` / `RefCell` はスレッド間で使えない。",
      "`mpsc::channel()` の送信者は `clone` で増やせる。全送信者を drop すると受信ループが終わる。",
      "`Send`（移動してよい）と `Sync`（共有してよい）がデータ競合をコンパイル時に防ぐ。",
    ],
  },
  learn: {
    quiz: [
      {
        prompt: "次のコードがコンパイルエラーになる理由は？",
        snippet: `let v = vec![1, 2, 3];
let h = std::thread::spawn(|| println!("{:?}", v));`,
        choices: [
          "スレッドが v より長生きするかもしれないので、借用では渡せない",
          "Vec はスレッドに渡せない型だから",
          "println! はスレッド内で使えないから",
          "join を呼んでいないから",
        ],
        answer: "スレッドが v より長生きするかもしれないので、借用では渡せない",
        explain: "spawn のクロージャは 'static が必要。`move` を付けて所有権ごと渡す（E0373）。",
      },
      {
        prompt: "複数スレッドでカウンタを共有して増やすのに適した型は？",
        choices: ["Arc<Mutex<i32>>", "Rc<RefCell<i32>>", "Rc<Mutex<i32>>", "Box<i32>"],
        answer: "Arc<Mutex<i32>>",
        explain: "所有者を複数にするスレッド安全な型は Arc、内部可変性のスレッド安全版は Mutex。",
      },
      {
        prompt: "`mpsc` の意味は？",
        choices: [
          "multiple producer, single consumer",
          "multi process shared channel",
          "memory protected safe channel",
          "main producer, sub consumer",
        ],
        answer: "multiple producer, single consumer",
        explain: "送信者（Sender）は clone で複数にできるが、受信者（Receiver）は 1 つ。",
      },
      {
        prompt: "`for v in rx { ... }` の受信ループが終わらない。原因として最も可能性が高いのは？",
        choices: [
          "元の送信者 tx を drop していない",
          "send の後に join していない",
          "rx を clone していない",
          "チャネルの容量が足りない",
        ],
        answer: "元の送信者 tx を drop していない",
        explain:
          "受信ループは全送信者が drop されるまで続く。clone 元の tx が main に残っているとずっと待つ。",
      },
      {
        prompt: "`Rc<T>` をスレッドに渡そうとしたときに出るエラーが言っていることは？",
        choices: [
          "Rc は Send を実装していない",
          "Rc は Clone を実装していない",
          "Rc は Debug を実装していない",
          "Rc は Copy を実装していない",
        ],
        answer: "Rc は Send を実装していない",
        explain:
          "Rc の参照カウント更新はアトミックでないため Send でない。スレッド間では Arc を使う。",
      },
      {
        prompt: "`thread::scope` の利点は？",
        choices: [
          "スコープ終了までに全スレッドが終わるので、外の変数を借用のまま渡せる",
          "スレッドが自動で並列数を調整される",
          "Mutex が不要になる",
          "panic しても止まらない",
        ],
        answer: "スコープ終了までに全スレッドが終わるので、外の変数を借用のまま渡せる",
        explain: "寿命がスコープ内に収まることが保証されるので 'static が要らない。",
      },
      {
        prompt: "「読み取りは同時に何人でも、書き込みは 1 人だけ」のロックは？",
        choices: ["RwLock", "Mutex", "AtomicBool", "Cell"],
        answer: "RwLock",
        explain: "RwLock は read() で共有ロック、write() で排他ロックを取る。",
      },
      {
        prompt: "Rust の型システムでも **防げない** ものは？",
        choices: [
          "デッドロック",
          "データ競合",
          "Rc のスレッド間共有",
          "ロックを取らずに Mutex の中身に触ること",
        ],
        answer: "デッドロック",
        explain:
          "データ競合はコンパイル時に防げるが、ロックの取り合いによるデッドロックは設計で避ける必要がある。",
      },
    ],
  },
});
