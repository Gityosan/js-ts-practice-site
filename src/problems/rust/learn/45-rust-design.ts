import { defineProblem } from "../../../core/schemas";

export default defineProblem({
  id: "rust-learn-idiomatic-design",
  stage: "learn",
  language: "rust",
  scenario: "rust",
  copy: {
    title: "総合演習: Rust らしい設計",
    prompt: `## この章について

ここまでで Rust の主要な文法はひと通り学んだ。この章では、それらを組み合わせて **Rust らしいプログラム** を設計するときの考え方をまとめ、総合問題で練習する。

Rust らしい設計の柱は 4 つ。

| 柱 | ひとことで |
|---|---|
| 所有権を意識した API | 誰がデータを持ち、誰が借りるのかを型で示す |
| enum で状態を表す | ありえない状態を作れないようにする |
| Result でエラーを伝える | 失敗しうることを型で示し、呼び出し側に判断させる |
| トレイトで抽象化 | 共通の振る舞いをまとめ、実装を差し替え可能にする |

## 1. 所有権を意識した API 設計

関数の引数と戻り値の型は「データを **どう扱うつもりか**」の宣言になる。

| 引数の型 | 意味 | 使う場面 |
|---|---|---|
| \`&T\` / \`&str\` / \`&[T]\` | 読むだけ（借用） | 調べる・計算する・表示する |
| \`&mut T\` | 書き換える（可変借用） | その場で更新する |
| \`T\` / \`String\` / \`Vec<T>\` | 所有権をもらう | 保存する・別の値に作り変える |

\`\`\`rust
// 読むだけ → 借用。String も &str も渡せるように &str で受ける
fn count_words(text: &str) -> usize {
    text.split_whitespace().count()
}

// その場で更新 → &mut
fn normalize(scores: &mut [u32]) {
    for s in scores.iter_mut() {
        *s = (*s).min(100);
    }
}

// 保存する → 所有権をもらう（呼び出し側が clone するか move するかを選べる）
struct Library { books: Vec<String> }
impl Library {
    fn add(&mut self, title: String) {
        self.books.push(title);
    }
    // 中身を見せるだけなら参照を返す
    fn titles(&self) -> &[String] {
        &self.books
    }
}
\`\`\`

指針:

- **引数は借用で受け取り、戻り値は所有権で返す** のが基本
- 内部に保存するなら所有権をもらう（\`&str\` で受けて中で \`to_string()\` するより、\`String\` で受けるほうが無駄なコピーを避けられる場合がある）
- \`clone()\` は悪ではないが、借用エラーを黙らせるために反射的に使わない
- \`impl Into<String>\` や \`impl AsRef<str>\` を使うと、呼び出し側の柔軟性が上がる

## 2. enum で状態を表す

フラグ（\`bool\`）や「\`None\` かもしれないフィールド」をたくさん持つ構造体は、ありえない組み合わせを作れてしまう。

\`\`\`rust
// 悪い例: 「接続していないのに session_id がある」状態が作れてしまう
struct Connection {
    connected: bool,
    session_id: Option<u32>,
    error: Option<String>,
}

// 良い例: 状態ごとに持つデータを決める
enum ConnectionState {
    Disconnected,
    Connecting { attempt: u32 },
    Connected { session_id: u32 },
    Failed { reason: String },
}
\`\`\`

\`match\` で状態ごとに処理を分ければ、**状態の追加漏れはコンパイラが教えてくれる**（網羅性チェック）。

### 状態遷移を関数で書く

\`\`\`rust
enum Door { Open, Closed, Locked }
enum Action { Open, Close, Lock, Unlock }

fn next(state: Door, action: Action) -> Result<Door, String> {
    match (state, action) {
        (Door::Closed, Action::Open) => Ok(Door::Open),
        (Door::Open, Action::Close) => Ok(Door::Closed),
        (Door::Closed, Action::Lock) => Ok(Door::Locked),
        (Door::Locked, Action::Unlock) => Ok(Door::Closed),
        _ => Err(String::from("その操作はできません")),
    }
}
\`\`\`

タプルで \`match\` すると、「状態 × 操作」の表をそのままコードにできる。これが **状態機械（ステートマシン）** の Rust らしい書き方。

## 3. Result でエラーを伝える

失敗しうる操作は \`Result<T, E>\` を返す。エラーの種類は **enum** で表すと、呼び出し側が種類ごとに対処できる。

\`\`\`rust
use std::fmt;

#[derive(Debug, PartialEq)]
enum BankError {
    InsufficientFunds { needed: u64, available: u64 },
    AccountNotFound(String),
    InvalidAmount,
}

impl fmt::Display for BankError {
    fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
        match self {
            BankError::InsufficientFunds { needed, available } =>
                write!(f, "残高不足: {needed} 必要ですが {available} しかありません"),
            BankError::AccountNotFound(id) => write!(f, "口座 {id} がありません"),
            BankError::InvalidAmount => write!(f, "金額が不正です"),
        }
    }
}

impl std::error::Error for BankError {}

fn withdraw(balance: u64, amount: u64) -> Result<u64, BankError> {
    if amount == 0 {
        return Err(BankError::InvalidAmount);
    }
    balance.checked_sub(amount).ok_or(BankError::InsufficientFunds {
        needed: amount,
        available: balance,
    })
}
\`\`\`

指針:

- ライブラリ的なコードでは **\`panic!\` / \`unwrap()\` を避けて \`Result\` を返す**（呼び出し側が回復方法を選べる）
- \`?\` 演算子でエラーを上へ伝える。\`From\` を実装すればエラー型の変換も自動
- 「ありえない」バグ（プログラムの前提違反）には \`panic!\` / \`unreachable!\` を使ってよい
- 値がない可能性は \`Option\`、失敗の理由を伝えたいなら \`Result\`

## 4. トレイトで抽象化

共通の振る舞いをトレイトにすると、具体的な型に依存しないコードが書ける。

\`\`\`rust
trait Shape {
    fn area(&self) -> f64;
    fn name(&self) -> String {
        String::from("図形") // デフォルト実装
    }
}

struct Circle { r: f64 }
struct Rect { w: f64, h: f64 }

impl Shape for Circle {
    fn area(&self) -> f64 { std::f64::consts::PI * self.r * self.r }
    fn name(&self) -> String { String::from("円") }
}
impl Shape for Rect {
    fn area(&self) -> f64 { self.w * self.h }
}

// 静的ディスパッチ（ジェネリクス）: 型ごとに専用コードが生成され速い
fn print_area<S: Shape>(s: &S) {
    println!("{}: {:.2}", s.name(), s.area());
}

// 動的ディスパッチ（トレイトオブジェクト）: 違う型を 1 つの Vec に入れられる
fn total_area(shapes: &[Box<dyn Shape>]) -> f64 {
    shapes.iter().map(|s| s.area()).sum()
}
\`\`\`

| 方法 | 書き方 | 特徴 |
|---|---|---|
| ジェネリクス | \`fn f<T: Trait>(x: &T)\` / \`impl Trait\` | コンパイル時に型が決まる。速い |
| トレイトオブジェクト | \`&dyn Trait\` / \`Box<dyn Trait>\` | 実行時に決まる。異なる型を混ぜられる |
| enum | \`enum Shape { Circle(..), Rect(..) }\` | 種類が固定なら最もシンプル。match で網羅 |

種類が決まっていて増えないなら enum、外部から種類を追加させたいならトレイト、と使い分ける。

## 標準トレイトを実装して「普通の型」にする

自作の型には、必要に応じて標準トレイトを付けると扱いやすくなる。

| トレイト | できるようになること |
|---|---|
| \`Debug\` | \`{:?}\` で表示、\`assert_eq!\` の失敗表示 |
| \`Clone\` / \`Copy\` | 複製 |
| \`PartialEq\` / \`Eq\` | \`==\` で比較 |
| \`PartialOrd\` / \`Ord\` | 大小比較、ソート |
| \`Hash\` | \`HashMap\` のキー、\`HashSet\` の要素 |
| \`Default\` | \`T::default()\`、\`mem::take\` |
| \`Display\` | \`{}\` で表示、\`to_string()\` |
| \`From\` / \`Into\` | 型変換、\`?\` でのエラー変換 |
| \`Iterator\` | \`for\` で回す、イテレータアダプタ |

多くは \`#[derive(...)]\` で一行で付けられる。

## データ構造の選び方

| やりたいこと | 選ぶもの |
|---|---|
| 順番に並べる・末尾に追加 | \`Vec<T>\` |
| キーで引く | \`HashMap<K, V>\`（順序が必要なら \`BTreeMap\`） |
| 重複を除く・含むか調べる | \`HashSet<T>\` / \`BTreeSet<T>\` |
| 両端から出し入れ（キュー） | \`VecDeque<T>\` |
| 最大・最小を素早く取り出す | \`BinaryHeap<T>\` |
| スタック | \`Vec<T>\` の \`push\` / \`pop\` |

## 設計の流れ（総合問題の解き方）

- まず **データの形** を決める（構造体・enum）。何が起きうるかを型で表す
- 次に **関数のシグネチャ** を決める。引数は借用か所有か、失敗するなら \`Result\`
- 中身は小さな関数に分ける。イテレータで書けるところはイテレータで
- エッジケース（空、0、1 個、不正な入力）を考える
- コンパイラのエラーと警告を読み、\`cargo clippy\` で仕上げる

次からの総合問題では、これらを組み合わせて小さなプログラムを作る。単語の頻度、計算機、括弧チェック、在庫管理、状態機械、トークナイザ、行列、圧縮、ToDo リスト、銀行システム。どれも「データの形を決める → シグネチャを決める → 中身を書く」の順で考えよう。`,
    hints: [
      "引数は借用（`&str` / `&[T]`）、戻り値は所有（`String` / `Vec<T>`）が基本。保存するなら所有権をもらう。",
      "enum で状態を表し、ありえない状態を作れないようにする。`match` の網羅性チェックが漏れを防ぐ。",
      "失敗しうる処理は `Result<T, エラー enum>` を返し、`?` で伝える。",
      "共通の振る舞いはトレイト。種類が固定なら enum、拡張させたいならトレイト。",
    ],
  },
  learn: {
    quiz: [
      {
        prompt: "文字列を読むだけの関数の引数として最も Rust らしいのは？",
        choices: ["text: &str", "text: String", "text: &String", "text: &mut String"],
        answer: "text: &str",
        explain: "&str で受ければ String も文字列リテラルも渡せ、所有権も奪わない。",
      },
      {
        prompt: "「接続中なのにエラーメッセージもある」のような矛盾した状態を防ぐ設計は？",
        choices: [
          "状態ごとにデータを持つ enum にする",
          "bool のフラグを増やす",
          "すべてのフィールドを Option にする",
          "状態を文字列で持つ",
        ],
        answer: "状態ごとにデータを持つ enum にする",
        explain:
          "enum のバリアントごとに必要なデータだけを持たせると、ありえない組み合わせは型として作れない。",
      },
      {
        prompt: "ライブラリの関数で、入力が不正だったときの扱いとして適切なのは？",
        choices: [
          "Result で Err を返し、呼び出し側に判断させる",
          "panic! で止める",
          "unwrap() する",
          "黙ってデフォルト値を返す",
        ],
        answer: "Result で Err を返し、呼び出し側に判断させる",
        explain: "回復可能な失敗は Result で伝える。panic はプログラムの前提違反（バグ）に使う。",
      },
      {
        prompt: "違う型の図形（Circle, Rect）を 1 つの Vec に入れて面積を合計したい。要素の型は？",
        choices: ["Box<dyn Shape>", "impl Shape", "T: Shape", "&Shape"],
        answer: "Box<dyn Shape>",
        explain:
          "トレイトオブジェクトなら異なる具体型を同じ Vec に入れられる（動的ディスパッチ）。",
      },
      {
        prompt: "`match (state, action)` のようにタプルで match する利点は？",
        choices: [
          "状態 × 操作の組み合わせを表のように書け、網羅性もチェックされる",
          "実行速度が速くなる",
          "所有権が不要になる",
          "エラーが出なくなる",
        ],
        answer: "状態 × 操作の組み合わせを表のように書け、網羅性もチェックされる",
        explain: "状態機械の遷移表をそのままコードにできる。",
      },
      {
        prompt: "自作の型を HashMap のキーにするために必要なトレイトの組み合わせは？",
        choices: ["Eq と Hash", "Debug と Clone", "Ord と Display", "Default と Copy"],
        answer: "Eq と Hash",
        explain:
          "HashMap はハッシュ値で探し、== で同一性を確かめる。`#[derive(PartialEq, Eq, Hash)]` を付ける。",
      },
      {
        prompt: "キューとして両端から出し入れしたい。適したコレクションは？",
        choices: ["VecDeque", "Vec", "HashSet", "BinaryHeap"],
        answer: "VecDeque",
        explain: "VecDeque は先頭・末尾どちらへの追加・削除も O(1)。",
      },
    ],
  },
});
