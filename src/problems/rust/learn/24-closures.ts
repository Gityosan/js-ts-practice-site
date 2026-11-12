import { defineProblem } from "../../../core/schemas";

export default defineProblem({
  id: "rust-learn-closures",
  stage: "learn",
  language: "rust",
  scenario: "rust",
  copy: {
    title: "クロージャ（環境をキャプチャする無名関数）",
    prompt: `## クロージャとは

**クロージャ（closure）** は、その場で書ける **無名関数**。JS のアロー関数 \`(x) => x + 1\` に相当する。
さらに、定義した場所の **周りの変数（環境）を取り込んで（キャプチャして）** 使える。

\`\`\`rust
let add_one = |x: i32| -> i32 { x + 1 };
let add_one = |x| x + 1;          // 型も {} も省略できる（推論される）
println!("{}", add_one(5));       // 6

let greet = || println!("hi");    // 引数なし
greet();
\`\`\`

\`\`\`rust
let f1 = |x| x + 1;                     // 引数 x を取り x + 1 を返す
let f2 = |a, b| a * b;                  // 引数 2 つ
let f3 = || 42;                         // 引数なし
let f4 = |x: i32| -> i32 { x + 1 };     // 型を明示（本体が複数文なら {} が必要）
\`\`\`

### 関数との違い

- \`fn\` は周りの変数を使えないが、クロージャは使える
- クロージャの引数・戻り値の型は **推論される**（関数は必須）
- ただし、一度推論された型は固定される。\`let id = |x| x; id(1); id("a");\` は \`error[E0308]\`

\`\`\`rust
let factor = 3;
let times = |x| x * factor;   // factor をキャプチャ
println!("{}", times(5));     // 15

// fn times_fn(x: i32) -> i32 { x * factor } // error[E0434]: fn は環境をキャプチャできない
\`\`\`

## 環境のキャプチャ: 3 つの方法

クロージャは、中で変数を **どう使っているか** を見て、最小限の方法で自動的にキャプチャする。

### 1. 不変借用（&）… 読むだけ

\`\`\`rust
let list = vec![1, 2, 3];
let print = || println!("{:?}", list); // &list を借りる
print();
println!("{:?}", list);                 // 借用中でも読める
\`\`\`

### 2. 可変借用（&mut）… 書き換える

\`\`\`rust
let mut count = 0;
let mut inc = || count += 1;    // &mut count を借りる。クロージャ自身も mut が必要
inc();
inc();
// println!("{}", count);       // inc を使う予定がある間はダメ（可変借用中）
println!("{}", count);          // 2（inc を使い終わったので OK）
\`\`\`

### 3. 所有権を奪う（move）

\`move\` キーワードを付けると、使う変数の **所有権をクロージャに移す**（Copy 型ならコピー）。

\`\`\`rust
let name = String::from("Ferris");
let hello = move || format!("Hello, {}", name); // name はクロージャに移動
println!("{}", hello());
// println!("{}", name);  // error[E0382]: name は move 済み
\`\`\`

**move が必要になる典型例**: クロージャを関数から **返す** とき、**別スレッドに渡す** とき。元の変数が先に消えてしまうので、借用では足りない（\`error[E0373]\`）。

\`\`\`rust
use std::thread;
let v = vec![1, 2, 3];
let handle = thread::spawn(move || println!("{:?}", v));
handle.join().unwrap();
\`\`\`

中で値を消費する（例えば \`drop(s)\` や、所有権を返す）と、move を書かなくても所有権ごとキャプチャされる。

## Fn / FnMut / FnOnce

すべてのクロージャは、次のトレイトの 1 つ以上を自動で実装する。**中で環境をどう使うか** で決まる。

| トレイト | 中でやっていること | 呼べる回数 | 呼ぶ側に必要なもの |
|---|---|---|---|
| \`Fn\` | 環境を読むだけ（または何もキャプチャしない） | 何回でも | \`&self\` |
| \`FnMut\` | 環境を書き換える | 何回でも | \`&mut self\`（mut な変数） |
| \`FnOnce\` | 環境の値を消費する（move して手放す） | **1 回だけ** | \`self\`（値を渡す） |

包含関係: **Fn ⊂ FnMut ⊂ FnOnce**。Fn なクロージャは FnMut や FnOnce が求められる場所にも渡せる。

\`\`\`rust
let s = String::from("bye");
let consume = || s;          // s を返す = 所有権を手放す → FnOnce
let t = consume();
// consume();                // error[E0382]: 2 回目は呼べない
\`\`\`

\`move\` は「どうキャプチャするか」、Fn 系は「中でどう使うか」で、別の話。\`move\` しても中で読むだけなら \`Fn\` になる。

## 引数にクロージャを取る

ジェネリクス + トレイト境界で受け取る。

\`\`\`rust
fn apply<F: Fn(i32) -> i32>(f: F, x: i32) -> i32 {
    f(x)
}

fn apply_impl(f: impl Fn(i32) -> i32, x: i32) -> i32 { // impl Trait でも書ける
    f(x)
}

fn repeat<F: FnMut()>(mut f: F, n: usize) {  // FnMut を呼ぶには f を mut に
    for _ in 0..n {
        f();
    }
}

fn run_once<F: FnOnce() -> String>(f: F) -> String {
    f()   // FnOnce は 1 回だけ呼べる
}

let k = 10;
apply(|x| x + k, 5);  // 15
\`\`\`

**境界の選び方**: 受け取る側はなるべく **ゆるい** もの（FnOnce → FnMut → Fn の順）を選ぶと、渡せるクロージャが増える。1 回しか呼ばないなら FnOnce、複数回呼ぶが並行しないなら FnMut。

普通の関数も Fn 系を実装しているので、クロージャの代わりに **関数名** を渡せる。

\`\`\`rust
fn double(x: i32) -> i32 { x * 2 }
apply(double, 4);  // 8
\`\`\`

## クロージャを返す

クロージャの型には **名前がない**（コンパイラが作る固有の型）。だから戻り値には \`impl Fn\` か \`Box<dyn Fn>\` を使う。

\`\`\`rust
fn make_adder(n: i32) -> impl Fn(i32) -> i32 {
    move |x| x + n     // n を move しないと、関数終了で n が消える（E0373）
}

let add5 = make_adder(5);
println!("{}", add5(1)); // 6

fn make_counter() -> impl FnMut() -> u32 {
    let mut count = 0;
    move || {
        count += 1;    // クロージャが持っている count を書き換える
        count
    }
}

let mut c = make_counter();
c(); c();            // 1, 2
\`\`\`

**条件によって違うクロージャを返したい** 場合、\`impl Fn\` は 1 つの型しか返せない（クロージャは 1 つ 1 つ別の型）ので、**\`Box<dyn Fn>\`** を使う。

\`\`\`rust
fn make_op(op: char) -> Box<dyn Fn(i32, i32) -> i32> {
    match op {
        '+' => Box::new(|a, b| a + b),
        '*' => Box::new(|a, b| a * b),
        _ => Box::new(|_, _| 0),
    }
}
let f = make_op('*');
println!("{}", f(3, 4)); // 12
\`\`\`

\`Box<dyn Fn>\` は Vec に入れて、異なるクロージャを並べることもできる。

## 標準ライブラリでの利用

クロージャはイテレータやソートで大活躍する。

\`\`\`rust
let mut people = vec![("Bob", 30), ("Amy", 25), ("Cid", 35)];

people.sort_by_key(|p| p.1);                       // 年齢の昇順
people.sort_by(|a, b| b.1.cmp(&a.1));              // 年齢の降順
people.sort_by_key(|p| std::cmp::Reverse(p.1));    // これも降順

let oldest = people.iter().max_by_key(|p| p.1);    // Some(&("Cid", 35))
people.retain(|p| p.1 >= 30);                      // 条件を満たすものだけ残す

let x: Option<i32> = None;
let v = x.unwrap_or_else(|| 0);                    // None のときだけ計算する
let doubled: Vec<i32> = vec![1, 2].iter().map(|n| n * 2).collect();
\`\`\`

## まとめ

- \`|引数| 本体\` で書く無名関数。周りの変数をキャプチャできる
- キャプチャは自動で最小限（& → &mut → 所有）。\`move\` で強制的に所有権を移す
- 中での使い方で Fn（読む）/ FnMut（書く）/ FnOnce（消費する）が決まる
- 受け取るときは \`F: Fn(i32) -> i32\` や \`impl FnMut()\`
- 返すときは \`impl Fn\`（1 種類）か \`Box<dyn Fn>\`（複数種類）。たいてい \`move\` が必要`,
    hints: [
      "`|x| x + 1` で無名関数。周りの変数をキャプチャできる。",
      "Fn は読むだけ、FnMut は書き換える、FnOnce は消費する（1 回だけ呼べる）。",
      "クロージャを返すときは `impl Fn` か `Box<dyn Fn>`。`move` でキャプチャした値を持たせる。",
      "sort_by_key / max_by_key / retain / unwrap_or_else などでクロージャを渡す。",
    ],
  },
  learn: {
    quiz: [
      {
        prompt: "次のクロージャが実装する一番制約の強いトレイトは？",
        snippet: `let mut total = 0;
let mut add = |x: i32| total += x;
`,
        choices: ["FnMut", "Fn", "FnOnce だけ", "どれも実装しない"],
        answer: "FnMut",
        explain: "キャプチャした total を書き換えているので FnMut（と FnOnce）。Fn ではない。",
      },
      {
        prompt: "`move` キーワードの効果は？",
        choices: [
          "使う変数の所有権をクロージャに移す",
          "クロージャを 1 回しか呼べなくする",
          "クロージャを別スレッドで実行する",
          "クロージャを Fn にする",
        ],
        answer: "使う変数の所有権をクロージャに移す",
        explain:
          "move は「どうキャプチャするか」を決める。呼べる回数（Fn 系）は中で値をどう使うかで決まる。",
      },
      {
        prompt: "次のコードが E0373 になる理由と直し方は？",
        snippet: `fn make_adder(n: i32) -> impl Fn(i32) -> i32 {
    |x| x + n
}
`,
        choices: [
          "n を借用したまま返そうとしている。move |x| x + n にする",
          "戻り値の型が間違っている。Box にする",
          "n が mut でない。let mut にする",
          "クロージャは返せない",
        ],
        answer: "n を借用したまま返そうとしている。move |x| x + n にする",
        explain:
          "関数が終わると n は消えるので、借用では足りない。move で n をクロージャに持たせる。",
      },
      {
        prompt: "if で 2 種類の異なるクロージャを出し分けて返したい。戻り値の型は？",
        choices: [
          "Box<dyn Fn(i32) -> i32>",
          "impl Fn(i32) -> i32",
          "fn(i32) -> i32 しかない",
          "Fn(i32) -> i32",
        ],
        answer: "Box<dyn Fn(i32) -> i32>",
        explain:
          "クロージャは 1 つ 1 つが別の型なので、impl Fn では 1 種類しか返せない。Box<dyn Fn> なら実行時に呼び分けられる。",
      },
      {
        prompt: '`let s = String::from("x"); let f = || s;` の f について正しいのは？',
        choices: [
          "FnOnce で、1 回しか呼べない",
          "Fn で、何回でも呼べる",
          "FnMut で、何回でも呼べる",
          "コンパイルエラー",
        ],
        answer: "FnOnce で、1 回しか呼べない",
        explain:
          "s の所有権を返して手放すので、2 回目に返すものがない。だから FnOnce だけを実装する。",
      },
      {
        prompt: "`fn call<F: FnMut()>(f: F)` の中で `f()` を呼ぶと E0596 になった。直し方は？",
        choices: [
          "引数を mut f: F にする",
          "F: Fn() に変える必要がある",
          "f.clone() を呼ぶ",
          "move を付ける",
        ],
        answer: "引数を mut f: F にする",
        explain: "FnMut の呼び出しは &mut self が必要なので、f 自体が mut でなければならない。",
      },
      {
        prompt: "`people.sort_by_key(|p| p.age)` は何をする？",
        choices: [
          "age の昇順に並べ替える",
          "age の降順に並べ替える",
          "age だけの Vec を作る",
          "age が最大の要素を返す",
        ],
        answer: "age の昇順に並べ替える",
        explain:
          "クロージャが返したキーで昇順ソートする。降順なら std::cmp::Reverse(p.age) をキーにする。",
      },
    ],
  },
});
