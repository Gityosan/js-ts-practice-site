import { defineProblem } from "../../../core/schemas";

export default defineProblem({
  id: "rust-learn-modules-cargo",
  stage: "learn",
  language: "rust",
  scenario: "rust",
  copy: {
    title: "モジュールと可視性・クレート・Cargo",
    prompt: `## コードを整理する仕組み

プログラムが大きくなると、関連する機能をまとめ、内部の詳細を隠したくなる。Rust のモジュールシステムは次の階層でできている。

| 単位 | 説明 |
|---|---|
| **パッケージ** | \`Cargo.toml\` を持つ単位。1 つ以上のクレートを含む |
| **クレート** | コンパイルの単位。**バイナリクレート**（\`main\` を持つ実行ファイル）か **ライブラリクレート**（他から使われる部品） |
| **モジュール** | クレートの中で名前空間と可視性を区切る単位（\`mod\`） |
| **パス** | 要素を指す名前（\`crate::garden::vegetables::Asparagus\`） |

- \`src/main.rs\` がバイナリクレートの、\`src/lib.rs\` がライブラリクレートの **クレートルート**（起点）
- 1 つのパッケージにライブラリクレートは最大 1 つ、バイナリクレートは \`src/bin/*.rs\` でいくつでも置ける

## mod でモジュールを作る

\`\`\`rust
mod front_of_house {
    pub mod hosting {
        pub fn add_to_waitlist() -> String {
            String::from("席の順番待ちに追加")
        }

        fn seat_at_table() {} // pub なし = 非公開
    }

    mod serving {
        fn take_order() {}
    }
}

fn main() {
    // 絶対パス: クレートルートから
    crate::front_of_house::hosting::add_to_waitlist();
    // 相対パス: 今いるモジュールから
    front_of_house::hosting::add_to_waitlist();
}
\`\`\`

モジュールは木構造（**モジュールツリー**）になる。クレートルートは暗黙に \`crate\` という名前のモジュール。

\`\`\`text
crate
 ├── front_of_house
 │   ├── hosting
 │   │   ├── add_to_waitlist
 │   │   └── seat_at_table
 │   └── serving
 │       └── take_order
 └── main
\`\`\`

## 可視性（pub）

**Rust ではすべての要素がデフォルトで非公開（private）**。JS の \`export\` のように、公開したいものだけに \`pub\` を付ける。

- 非公開の要素は、**同じモジュールとその子孫モジュール** からだけ使える
- 子は親の非公開要素を使えるが、親は子の非公開要素を使えない
- 兄弟（同じ親を持つ）モジュールの要素は、その要素が \`pub\` なら使える
- パスの途中のモジュールも、たどる側から見えている必要がある（\`hosting\` が \`pub mod\` でなければ外から \`hosting::...\` と書けない）

非公開の要素を外から使うとエラー E0603（\`function \`seat_at_table\` is private\`）になる。

### 可視性の種類

| 書き方 | 見える範囲 |
|---|---|
| （なし） | 今のモジュールとその子孫 |
| \`pub\` | どこからでも（親がたどれる限り） |
| \`pub(crate)\` | 同じクレートの中だけ |
| \`pub(super)\` | 親モジュールまで |
| \`pub(in crate::a::b)\` | 指定したモジュールまで |

\`pub(crate)\` は「クレート内では共有したいが、ライブラリの利用者には見せたくない」ときによく使う。

## 構造体と enum の可視性

**構造体は、型に \`pub\` を付けてもフィールドは非公開のまま**。フィールドごとに \`pub\` を付ける。

\`\`\`rust
mod back_of_house {
    pub struct Breakfast {
        pub toast: String,       // 公開: 外から読み書きできる
        seasonal_fruit: String,  // 非公開: 外からは触れない
    }

    impl Breakfast {
        pub fn summer(toast: &str) -> Breakfast { // 非公開フィールドがあるので、コンストラクタが必須
            Breakfast {
                toast: String::from(toast),
                seasonal_fruit: String::from("桃"),
            }
        }
    }

    pub enum Appetizer { // enum は pub にすると全バリアントが公開
        Soup,
        Salad,
    }
}

fn eat() {
    let mut meal = back_of_house::Breakfast::summer("ライ麦");
    meal.toast = String::from("全粒粉");     // OK
    // meal.seasonal_fruit = ...;            // エラー: 非公開フィールド
    // back_of_house::Breakfast { toast: ..., seasonal_fruit: ... } // エラー: 外からは構造体リテラルで作れない
    let a = back_of_house::Appetizer::Soup;  // OK
}
\`\`\`

- 非公開フィールドが 1 つでもあると、外からは \`Breakfast { ... }\` で作れない → \`pub fn new\` などのコンストラクタを用意する
- これを利用して「不正な状態の値を作らせない」（残高を直接書き換えさせない等）設計ができる
- enum のバリアントは全部公開（一部だけ非公開にすると使い物にならないため）
- \`impl\` 内のメソッドも個別に \`pub\` が必要

## use でパスを短くする

\`\`\`rust
use crate::front_of_house::hosting;

fn eat_at_restaurant() {
    hosting::add_to_waitlist();
}
\`\`\`

\`use\` は **そのスコープだけ** に効く（別のモジュールの中では改めて \`use\` が必要）。

### 慣習

- **関数** は親モジュールまでを \`use\` して \`hosting::add_to_waitlist()\` と呼ぶ（どこで定義された関数か分かる）
- **構造体・enum・トレイト** はフルパスで \`use\` する: \`use std::collections::HashMap;\`
- 同じ名前がぶつかるときは親モジュールで区別するか、\`as\` で別名を付ける

\`\`\`rust
use std::fmt::Result;
use std::io::Result as IoResult; // as で別名

use std::io::{self, Write};       // std::io と std::io::Write を両方
use std::collections::*;          // glob（全部）。テストや prelude 以外では控えめに
\`\`\`

### pub use で再公開（re-export）

\`\`\`rust
mod shapes {
    pub mod circle {
        pub fn area(r: f64) -> f64 { 3.14 * r * r }
    }
    pub use self::circle::area as circle_area; // shapes::circle_area として公開
}

shapes::circle_area(1.0);
\`\`\`

内部の構造（深いモジュール階層）と、利用者に見せる API の形を分けられる。ライブラリでよく使う。

## self / super / crate

| キーワード | 意味 | 例 |
|---|---|---|
| \`crate\` | クレートルート | \`crate::config::load()\` |
| \`self\` | 今のモジュール | \`self::helper()\`、\`use self::inner::f;\` |
| \`super\` | 親モジュール | \`super::shared_fn()\`（ファイルシステムの \`..\` に相当） |

\`\`\`rust
fn deliver_order() {}

mod back_of_house {
    fn fix_incorrect_order() {
        cook_order();
        super::deliver_order(); // 親（クレートルート）の関数
    }
    fn cook_order() {}
}
\`\`\`

## モジュールをファイルに分ける（説明のみ）

このサイトの問題は 1 ファイルなので \`mod name { ... }\` とインラインで書くが、実際のプロジェクトではファイルに分ける。

\`\`\`text
src/
├── main.rs            // mod garden; と宣言
├── garden.rs          // garden モジュールの中身。pub mod vegetables; と宣言
└── garden/
    └── vegetables.rs  // garden::vegetables モジュールの中身
\`\`\`

\`\`\`rust
// src/main.rs
mod garden;                       // 「garden.rs（または garden/mod.rs）を読み込め」という宣言
use crate::garden::vegetables::Asparagus;
\`\`\`

- \`mod garden;\`（\`{}\` なし・セミコロン）で、コンパイラは \`src/garden.rs\` か \`src/garden/mod.rs\` を探す
- \`garden.rs\` の中で \`pub mod vegetables;\` と書けば \`src/garden/vegetables.rs\` を探す
- **\`mod\` 宣言はモジュールツリーに 1 回だけ**。他の場所からは \`use\` で参照する（\`mod\` は JS の \`import\` ではない）
- 古いスタイルの \`mod.rs\` と新しいスタイルの \`garden.rs\` は混在させないのが推奨

## Cargo と Cargo.toml

\`\`\`toml
[package]
name = "my_app"
version = "0.1.0"
edition = "2024"

[dependencies]
serde = { version = "1.0", features = ["derive"] }
rand = "0.8"

[dev-dependencies]   # テスト・ベンチマークのときだけ使う
pretty_assertions = "1"

[features]           # 利用者が選べるオプション機能
default = ["json"]
json = []
fast = []
\`\`\`

- **バージョン指定** \`"0.8"\` は \`^0.8\` の意味で、互換性のある最新（0.8.x）を使う（セマンティックバージョニング）
- 実際に使ったバージョンは **\`Cargo.lock\`** に記録され、全員が同じバージョンでビルドできる。\`cargo update\` で更新
- 依存クレートは \`use rand::Rng;\` のようにクレート名から使える
- **features** は条件付きコンパイルのスイッチ。コード側は \`#[cfg(feature = "json")]\` で切り替える。依存側の機能は \`features = ["derive"]\` で有効にする

### crates.io

Rust の公式パッケージレジストリ。\`cargo add rand\` で依存を追加し、\`cargo publish\` で自分のクレートを公開できる（公開したバージョンは削除できず、\`cargo yank\` で新規利用を止めるだけ）。

### ワークスペース

複数のパッケージを 1 つのリポジトリでまとめて管理する仕組み。\`Cargo.lock\` と出力ディレクトリ \`target/\` を共有する。

\`\`\`toml
# ルートの Cargo.toml
[workspace]
members = ["adder", "add_one"]
resolver = "3"
\`\`\`

\`\`\`toml
# adder/Cargo.toml でワークスペース内の別パッケージに依存
[dependencies]
add_one = { path = "../add_one" }
\`\`\`

\`cargo run -p adder\`、\`cargo test -p add_one\` のように \`-p\` でパッケージを選ぶ。

### よく使う Cargo コマンド

\`\`\`bash
cargo new my_app        # バイナリのパッケージを作る（--lib でライブラリ）
cargo build             # デバッグビルド（target/debug/）
cargo build --release   # 最適化ビルド（target/release/）
cargo run               # ビルドして実行
cargo check             # 型・借用の検査だけ（速い）
cargo test              # テスト（次章）
cargo add serde --features derive  # 依存を追加
cargo fmt               # rustfmt でコードを整形
cargo clippy            # Clippy（リンター）でよくないパターンを指摘
cargo doc --open        # ドキュメントコメントから HTML のドキュメントを生成して開く
\`\`\`

### ドキュメントコメント

\`\`\`rust
//! クレートやモジュール全体の説明（ファイルの先頭に書く）

/// 2 つの数を足す。
///
/// # Examples
///
/// \`\`\`
/// assert_eq!(my_crate::add(2, 3), 5);
/// \`\`\`
pub fn add(a: i32, b: i32) -> i32 {
    a + b
}
\`\`\`

- \`///\` は直後の要素の説明、\`//!\` は囲んでいる要素（クレート・モジュール）の説明。Markdown で書ける
- \`# Examples\` のコードブロックは \`cargo test\` で **ドキュメントテスト** として実行される（次章）
- よく使う見出し: \`# Examples\`、\`# Panics\`、\`# Errors\`、\`# Safety\``,
    hints: [
      "Rust の要素はデフォルトで非公開。公開するものに `pub`（クレート内だけなら `pub(crate)`）を付ける。",
      "構造体は `pub struct` でもフィールドは非公開のまま。非公開フィールドがあると外からはコンストラクタ経由でしか作れない。enum のバリアントは全部公開。",
      "パスは `crate::`（ルート）・`self::`（今）・`super::`（親）。`use` で短くし、`as` で別名、`pub use` で再公開。",
      "Cargo.toml に依存・features を書く。`cargo fmt` / `cargo clippy` / `cargo doc` が定番ツール。",
    ],
  },
  learn: {
    quiz: [
      {
        prompt: "モジュール内の関数に何も付けないときの可視性は？",
        choices: [
          "非公開（同じモジュールと子孫からだけ使える）",
          "公開（どこからでも使える）",
          "クレート内だけ公開",
          "コンパイルエラー",
        ],
        answer: "非公開（同じモジュールと子孫からだけ使える）",
        explain: "Rust はデフォルト非公開。外から使わせたいものだけ pub を付ける。",
      },
      {
        prompt: "次のコードで、モジュールの外から `c.secret` を読むとどうなる？",
        snippet: `mod m {
    pub struct Config {
        pub name: String,
        secret: String,
    }
}`,
        choices: [
          "コンパイルエラー（非公開フィールド）",
          "読める",
          "空文字列になる",
          "実行時に panic",
        ],
        answer: "コンパイルエラー（非公開フィールド）",
        explain: "pub struct にしてもフィールドは個別に pub が必要。",
      },
      {
        prompt: "`pub enum Color { Red, Green }` のバリアントの可視性は？",
        choices: [
          "すべて公開",
          "すべて非公開",
          "最初のバリアントだけ公開",
          "バリアントごとに pub が必要",
        ],
        answer: "すべて公開",
        explain: "enum は pub にすると全バリアントが公開される。構造体のフィールドとは逆。",
      },
      {
        prompt: "親モジュールの関数 `helper` を呼ぶパスは？",
        choices: ["super::helper()", "self::helper()", "parent::helper()", "..::helper()"],
        answer: "super::helper()",
        explain: "super は親モジュール、self は今のモジュール、crate はクレートルート。",
      },
      {
        prompt: "`pub(crate) fn f()` の意味は？",
        choices: [
          "同じクレートの中からだけ使える",
          "親モジュールからだけ使える",
          "外部クレートからだけ使える",
          "どこからでも使える",
        ],
        answer: "同じクレートの中からだけ使える",
        explain: "ライブラリの利用者には見せず、クレート内では共有したいときに使う。",
      },
      {
        prompt: "`use std::io::Result as IoResult;` の `as` の役割は？",
        choices: [
          "インポートした名前に別名を付ける",
          "型変換する",
          "トレイトを実装する",
          "モジュールを作る",
        ],
        answer: "インポートした名前に別名を付ける",
        explain: "std::fmt::Result と名前が衝突するときなどに使う。",
      },
      {
        prompt: "`src/main.rs` に `mod garden;` と書いたとき、コンパイラが探すファイルは？",
        choices: [
          "src/garden.rs または src/garden/mod.rs",
          "garden/main.rs",
          "src/lib.rs",
          "Cargo.toml の [modules] に書いたファイル",
        ],
        answer: "src/garden.rs または src/garden/mod.rs",
        explain: "{} なしの mod 宣言は、モジュール名のファイルから中身を読み込む。",
      },
      {
        prompt: "コードのよくないパターンを指摘してくれる Cargo のコマンドは？",
        choices: ["cargo clippy", "cargo fmt", "cargo doc", "cargo build --release"],
        answer: "cargo clippy",
        explain: "clippy はリンター。fmt は整形、doc はドキュメント生成。",
      },
    ],
  },
});
