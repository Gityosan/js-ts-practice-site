import { defineProblem } from "../../../core/schemas";

export default defineProblem({
  id: "rust-learn-advanced-types",
  stage: "learn",
  language: "rust",
  scenario: "rust",
  copy: {
    title: "高度な型（エイリアス・never・DST・PhantomData・fn）",
    prompt: `## この章で扱うこと

- \`type\` エイリアス（型の別名）
- never 型 \`!\`（決して返らない）
- 動的サイズ型（DST）と \`Sized\` / \`?Sized\`
- \`PhantomData\`（使わない型引数を持つ）
- 関数ポインタ \`fn\` 型とクロージャの違い

## type エイリアス

\`type 新しい名前 = 既存の型;\` で型に別名を付けられる。**新しい型を作るわけではない**（ニュータイプとの違い）。

\`\`\`rust
type Kilometers = i32;

let x: i32 = 5;
let y: Kilometers = 5;
println!("{}", x + y); // 10。Kilometers と i32 は完全に同じ型なので混ぜられる
\`\`\`

| | \`type Km = i32;\` | \`struct Km(i32);\` |
|---|---|---|
| 新しい型か | いいえ（ただの別名） | はい |
| i32 と混ぜられるか | 混ぜられる | 混ぜられない |
| トレイトを実装できるか | i32 への実装になる | Km に独自に実装できる |
| 目的 | 長い型名を短く・意味を付ける | 型の区別・孤児ルール回避 |

### 長い型を短くする

\`\`\`rust
type Thunk = Box<dyn Fn() -> i32 + Send + 'static>;

fn takes_long_type(f: Thunk) { /* ... */ }
fn returns_long_type() -> Thunk { Box::new(|| 42) }
\`\`\`

### ジェネリックなエイリアス（Result の定番パターン）

\`std::io\` では \`type Result<T> = std::result::Result<T, std::io::Error>;\` と定義されていて、\`io::Result<usize>\` のように書ける。自分のモジュールでも同じことができる。

\`\`\`rust
#[derive(Debug)]
enum AppError { NotFound, Invalid(String) }

type AppResult<T> = Result<T, AppError>; // エラー型を固定した Result

fn find(id: u32) -> AppResult<String> {
    if id == 1 { Ok("alice".to_string()) } else { Err(AppError::NotFound) }
}
\`\`\`

## never 型 !

\`!\` は **「値を決して返さない」** ことを表す特別な型（never type、空の型）。\`!\` 型の値は存在しない。

\`\`\`rust
fn forever() -> ! {
    loop {
        // break しない無限ループ
    }
}

fn fail(msg: &str) -> ! {
    panic!("{}", msg); // panic! の型は !
}
\`\`\`

\`!\` を返す関数を **発散する関数（diverging function）** と呼ぶ。

### なぜ便利か: ! はどんな型にもなれる

\`match\` の腕はすべて同じ型でなければならない。では、次はなぜ通るのか？

\`\`\`rust
let guess: u32 = match input.trim().parse() {
    Ok(num) => num,     // u32
    Err(_) => continue, // continue の型は !
};
\`\`\`

\`continue\` は値を返さず、ループの先頭に戻る。型は \`!\` で、**\`!\` はどんな型にも強制（coerce）できる**。だから match 全体の型は \`u32\` になる。

\`!\` 型を持つ式の例:

- \`panic!(...)\`、\`unreachable!()\`、\`todo!()\`、\`unimplemented!()\`
- \`continue\`、\`break\`、\`return\`
- \`loop { }\`（break を含まないもの）
- \`std::process::exit(code)\`

\`Option::unwrap\` もこの仕組みで書かれている。

\`\`\`rust
impl<T> Option<T> {
    pub fn unwrap(self) -> T {
        match self {
            Some(val) => val,                                     // T
            None => panic!("called \`Option::unwrap()\` on a \`None\` value"), // ! → T に強制
        }
    }
}
\`\`\`

\`todo!()\` を書いた関数がどんな戻り値の型でもコンパイルが通るのも、\`todo!()\` が \`!\` 型だから。

## 動的サイズ型（DST）と Sized

Rust はふつう **コンパイル時に型のサイズが分かる** ことを前提にしている（スタックに置くため）。しかし、サイズが実行時まで分からない型もある。これを **動的サイズ型（DST, dynamically sized type）** または unsized type と呼ぶ。

| DST | 説明 | 使い方 |
|---|---|---|
| \`str\` | 長さ不定の UTF-8 文字列 | \`&str\`, \`Box<str>\`, \`Rc<str>\` |
| \`[T]\` | 長さ不定のスライス | \`&[T]\`, \`Box<[T]>\` |
| \`dyn Trait\` | 実装する型によってサイズが違う | \`&dyn Trait\`, \`Box<dyn Trait>\` |

\`\`\`rust
// let s1: str = "hello"; // エラー: str のサイズがコンパイル時に分からない
let s1: &str = "hello";   // OK: 参照（ポインタ + 長さ）なら固定サイズ
\`\`\`

**黄金律: DST は必ずポインタの後ろに置く。** DST へのポインタは「アドレス + 追加情報」のファットポインタになる。

- \`&str\` / \`&[T]\` … アドレス + **長さ**
- \`&dyn Trait\` … アドレス + **vtable**

\`\`\`rust
use std::mem::size_of;
assert_eq!(size_of::<&i32>(), size_of::<usize>());     // 普通の参照: 1 ワード
assert_eq!(size_of::<&str>(), 2 * size_of::<usize>()); // ファットポインタ: 2 ワード
\`\`\`

### Sized トレイト

「コンパイル時にサイズが分かる型」は自動で \`Sized\` トレイトを実装する。そして **ジェネリクスの型引数には暗黙に \`Sized\` 境界が付く**。

\`\`\`rust
fn generic<T>(t: T) {}
// 実際には次と同じ意味
fn generic<T: Sized>(t: T) {}
\`\`\`

### ?Sized で制約を外す

DST も受け付けたいときは \`?Sized\`（「Sized かもしれないし、そうでないかもしれない」）と書く。

\`\`\`rust
use std::fmt::Debug;

fn show<T: Debug + ?Sized>(t: &T) -> String {
    format!("{:?}", t)
}

show("hello");      // T = str（DST）でも OK
show(&[1, 2][..]);  // T = [i32]（DST）でも OK
show(&5);           // T = i32 でももちろん OK
\`\`\`

- \`?Sized\` を付けると \`T\` のサイズが分からないかもしれないので、**\`t: T\`（値渡し）ではなく \`t: &T\` のようにポインタ越し** で受け取る必要がある
- \`?\` を付けられる境界は \`Sized\` だけ
- 標準ライブラリでは \`Box<T: ?Sized>\`, \`Rc<T: ?Sized>\`, \`impl<T: ?Sized> ... for &T\` などあちこちで使われている（だから \`Box<str>\` や \`Box<dyn Trait>\` が作れる）
- トレイトの \`Self\` はデフォルトで \`?Sized\`（だから \`impl Trait for str\` が書ける）

## PhantomData: 使わない型引数

構造体に型引数 \`T\` を付けたのにフィールドで使わないと、コンパイルエラーになる。

\`\`\`rust
struct Id<T> {
    value: u32,
} // エラー[E0392]: type parameter \`T\` is never used
\`\`\`

\`std::marker::PhantomData<T>\` は **サイズ 0 のフィールド** で、「この構造体は T に関係している」とコンパイラに伝える。

\`\`\`rust
use std::marker::PhantomData;

struct User;
struct Order;

struct Id<T> {
    value: u32,
    _marker: PhantomData<T>, // 実行時のメモリは 0 バイト
}

impl<T> Id<T> {
    fn new(value: u32) -> Self {
        Id { value, _marker: PhantomData }
    }
}

fn find_user(id: Id<User>) { /* ... */ }

let uid: Id<User> = Id::new(1);
let oid: Id<Order> = Id::new(1);
find_user(uid);
// find_user(oid); // エラー: Id<Order> は Id<User> ではない
\`\`\`

中身はどちらも \`u32\` なのに、**型の上では区別される**。ユーザー ID と注文 ID の取り違えをコンパイル時に防げる。これを「型レベルのタグ」「幽霊型（phantom type）」と呼ぶ。

用途:

- ID や単位（メートル / フィート）の区別
- 状態の型での表現（\`Door<Open>\` と \`Door<Closed>\` で使えるメソッドを変える＝タイプステートパターン）
- \`unsafe\` コードで「論理的には T を所有している」ことを伝える（ドロップチェックや変性のため）

\`PhantomData\` は値としても型としても同じ名前 \`PhantomData\` で書く（ユニット構造体なので）。

## 関数ポインタ fn

関数そのものを値として渡せる。型は \`fn(引数の型) -> 戻り値の型\`（小文字の \`fn\`）。

\`\`\`rust
fn add_one(x: i32) -> i32 {
    x + 1
}

fn do_twice(f: fn(i32) -> i32, arg: i32) -> i32 {
    f(arg) + f(arg)
}

assert_eq!(do_twice(add_one, 5), 12);
\`\`\`

### fn とクロージャのトレイト（Fn / FnMut / FnOnce）の違い

| | \`fn(i32) -> i32\`（関数ポインタ） | \`impl Fn(i32) -> i32\` / \`dyn Fn\` |
|---|---|---|
| 正体 | **型**（関数のアドレス） | **トレイト** |
| 環境のキャプチャ | できない | できる |
| サイズ | ポインタ 1 個（固定） | クロージャごとに違う |
| 渡せるもの | 関数、**キャプチャしない** クロージャ | 関数、すべてのクロージャ |

- 関数ポインタは \`Fn\` / \`FnMut\` / \`FnOnce\` の 3 つすべてを実装しているので、**クロージャを受け取る関数に関数名を渡せる**
- 逆に、外の変数をキャプチャするクロージャは \`fn\` 型には入らない

\`\`\`rust
let k = 10;
let f: fn(i32) -> i32 = |x| x + 1;  // OK: キャプチャしない
// let g: fn(i32) -> i32 = |x| x + k; // エラー: k をキャプチャしている
\`\`\`

一般には **クロージャのトレイト（\`impl Fn\` / ジェネリクス）で受け取るほうが柔軟**。\`fn\` 型が向いているのは:

- C 言語など外部とのやりとり（C にはクロージャがない）
- 関数の表（\`[fn(i32) -> i32; 3]\` や \`HashMap<&str, fn(f64, f64) -> f64>\`）を作るとき（型が 1 つに決まるので配列に入れやすい）

### 関数名やタプル構造体を map に渡す

\`\`\`rust
let strings: Vec<String> = vec![1, 2, 3].iter().map(ToString::to_string).collect();

#[derive(Debug)]
enum Status { Value(u32) }
let list: Vec<Status> = (0u32..3).map(Status::Value).collect(); // バリアント名は関数として使える
\`\`\`

タプル構造体やタプル風 enum バリアントの名前は、**初期化関数** として \`fn\` のように扱える。

### クロージャを返す

クロージャは型名を書けないので、返すときは \`impl Fn\` か \`Box<dyn Fn>\` を使う。

\`\`\`rust
fn make_adder(n: i32) -> impl Fn(i32) -> i32 {
    move |x| x + n
}

fn make_op(kind: &str) -> Box<dyn Fn(i32) -> i32> {
    match kind {
        "double" => Box::new(|x| x * 2),
        _ => Box::new(|x| x),
    } // 腕ごとにクロージャの型が違うので impl Fn ではなく Box<dyn Fn>
}
\`\`\``,
    hints: [
      "`type` エイリアスはただの別名で新しい型ではない。`type Result<T> = std::result::Result<T, MyError>;` が定番。",
      "never 型 `!` はどんな型にもなれる。`panic!`・`continue`・`loop {}` などが `!` 型。",
      "ジェネリクスには暗黙に `Sized` が付く。`str` / `[T]` / `dyn Trait` を受けたいなら `T: ?Sized` にして `&T` で受け取る。",
      "`PhantomData<T>` はサイズ 0 で型だけを持つ。`fn` 型は関数ポインタで、キャプチャしないクロージャも入る。",
    ],
  },
  learn: {
    quiz: [
      {
        prompt: "`type Km = i32;` について正しいのは？",
        choices: [
          "Km と i32 は同じ型として扱われ、混ぜて計算できる",
          "Km は i32 とは別の新しい型になる",
          "Km にだけ独自のトレイトを実装できる",
          "Km は構造体になる",
        ],
        answer: "Km と i32 は同じ型として扱われ、混ぜて計算できる",
        explain:
          "type エイリアスは別名にすぎない。型を区別したいならニュータイプ struct Km(i32) を使う。",
      },
      {
        prompt: "次の match がコンパイルできる理由は？",
        snippet: `let n: u32 = match s.parse() {
    Ok(n) => n,
    Err(_) => continue,
};`,
        choices: [
          "continue の型は ! で、どんな型にも強制できるから",
          "continue は 0 を返すから",
          "Err の腕は型検査されないから",
          "u32 は何でも受け入れるから",
        ],
        answer: "continue の型は ! で、どんな型にも強制できるから",
        explain: "値を返さない式は never 型。match 全体の型は u32 になる。",
      },
      {
        prompt: "never 型 `!` を **持たない** 式は？",
        choices: ["0", 'panic!("x")', "loop {}（break なし）", "return"],
        answer: "0",
        explain: "0 は整数型。panic!・無限ループ・return は値を作らずに制御が移るので ! 型。",
      },
      {
        prompt: '`fn show<T: Debug>(t: &T)` に `show("abc")` を渡すとエラーになる。直し方は？',
        choices: [
          "T: Debug + ?Sized にする",
          "T: Debug + Sized にする",
          "t: T に変える",
          "T: Clone を追加する",
        ],
        answer: "T: Debug + ?Sized にする",
        explain: "T = str は DST。ジェネリクスの暗黙の Sized 境界を ?Sized で外す。",
      },
      {
        prompt: "`&str` が持っている情報は？",
        choices: [
          "データのアドレスと長さ",
          "データのアドレスだけ",
          "vtable へのポインタ",
          "文字列のコピー",
        ],
        answer: "データのアドレスと長さ",
        explain: "str は DST なので、参照はアドレス + 長さのファットポインタになる。",
      },
      {
        prompt: "`PhantomData<T>` を構造体に入れる目的は？",
        choices: [
          "フィールドで使わない型引数 T を構造体に関係づける（サイズは 0）",
          "T の値を遅延して作る",
          "T をヒープに置く",
          "T を可変にする",
        ],
        answer: "フィールドで使わない型引数 T を構造体に関係づける（サイズは 0）",
        explain: "使われない型引数はエラー（E0392）になる。PhantomData で型レベルのタグにできる。",
      },
      {
        prompt: "`fn(i32) -> i32` 型の変数に代入 **できない** ものは？",
        snippet: `let k = 3;`,
        choices: ["|x| x + k", "|x| x + 1", "関数 fn add_one(x: i32) -> i32", "i32::abs"],
        answer: "|x| x + k",
        explain:
          "外の変数 k をキャプチャするクロージャは関数ポインタにならない。キャプチャしないクロージャと関数は OK。",
      },
      {
        prompt: "match の腕ごとに違うクロージャを返したい。戻り値の型は？",
        choices: ["Box<dyn Fn(i32) -> i32>", "impl Fn(i32) -> i32", "Fn(i32) -> i32", "fn"],
        answer: "Box<dyn Fn(i32) -> i32>",
        explain:
          "クロージャはそれぞれ別の型。impl Fn は 1 種類の型しか返せないので、Box<dyn Fn> にする（キャプチャしないなら fn 型でも可）。",
      },
    ],
  },
});
