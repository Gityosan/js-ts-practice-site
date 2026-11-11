import { defineProblem } from "../../../core/schemas";

export default defineProblem({
  id: "rust-learn-testing",
  stage: "learn",
  language: "rust",
  scenario: "rust",
  copy: {
    title: "テストを書く（#[test] と cargo test）",
    prompt: `## Rust のテストの考え方

型システムや借用チェッカーは多くのバグをコンパイル時に防ぐが、「計算結果が正しいか」までは保証しない。そこでテストを書く。
Rust は **テストの仕組みが言語とツールに組み込まれている**。JS のように Jest などを別途入れる必要はない。

\`\`\`bash
cargo test
\`\`\`

これだけで、プロジェクト内のテスト関数が集められて実行される。

## テスト関数の基本

\`\`\`rust
pub fn add(a: i32, b: i32) -> i32 {
    a + b
}

#[cfg(test)]
mod tests {
    use super::*; // 親モジュール（テスト対象）の要素をすべて取り込む

    #[test]
    fn adds_two_numbers() {
        let result = add(2, 2);
        assert_eq!(result, 4);
    }
}
\`\`\`

- \`#[test]\` 属性を付けた関数がテストになる（引数なし）
- テスト関数が **panic したら失敗**、最後まで走れば成功
- テストはそれぞれ **別スレッドで並列に** 実行される

\`\`\`text
running 1 test
test tests::adds_two_numbers ... ok

test result: ok. 1 passed; 0 failed; 0 ignored; 0 measured; 0 filtered out
\`\`\`

### #[cfg(test)] と mod tests

- \`#[cfg(test)]\` は「\`cargo test\` のときだけコンパイルする」という **条件付きコンパイル** の指定。通常のビルド（\`cargo build\`）ではテストコードが含まれず、バイナリが小さく速く保たれる
- 慣習として、テスト対象と **同じファイル** の末尾に \`mod tests\` を置く
- \`tests\` は子モジュールなので、親の **非公開関数もテストできる**（Rust では非公開関数のテストも許されている）
- \`use super::*;\` で親の要素を取り込むのが定番

## アサーションマクロ

| マクロ | 成功条件 | 失敗時の表示 |
|---|---|---|
| \`assert!(cond)\` | \`cond\` が true | 条件式 |
| \`assert_eq!(left, right)\` | \`left == right\` | 両方の値（Debug 表示） |
| \`assert_ne!(left, right)\` | \`left != right\` | 両方の値 |
| \`debug_assert!\` など | 同上（デバッグビルドのときだけ検査） | |

\`\`\`rust
#[test]
fn larger_can_hold_smaller() {
    let larger = Rect { w: 8, h: 7 };
    let smaller = Rect { w: 5, h: 1 };
    assert!(larger.can_hold(&smaller));
    assert!(!smaller.can_hold(&larger));
}

#[test]
fn values() {
    assert_eq!(add(2, 3), 5);
    assert_ne!(add(2, 3), 6);
}
\`\`\`

- \`assert_eq!\` / \`assert_ne!\` で比べる値は **\`PartialEq\` と \`Debug\`** を実装している必要がある（自作の構造体なら \`#[derive(PartialEq, Debug)]\`）
- Rust では引数の順番に決まりはなく「left / right」と呼ぶ（期待値・実際値の区別はない）
- 失敗時の表示:

\`\`\`text
assertion \`left == right\` failed
  left: 5
 right: 6
\`\`\`

### カスタムメッセージ

アサーションの後ろの引数は \`format!\` と同じ書式で、失敗時のメッセージになる。

\`\`\`rust
assert!(result.contains("Carol"), "挨拶に名前が含まれていない。実際の値: \`{}\`", result);
assert_eq!(v.len(), 3, "要素数がおかしい: {:?}", v);
\`\`\`

### アサーションはテスト以外でも使える

\`assert!\` はただの「条件が偽なら panic するマクロ」なので、**普通のコードで前提条件（不変条件）を検査する** のにも使う。

\`\`\`rust
pub fn new_guess(value: i32) -> i32 {
    assert!((1..=100).contains(&value), "Guess value must be between 1 and 100, got {}.", value);
    value
}
\`\`\`

## #[should_panic]: panic することをテストする

「不正な入力では panic すること」もテストしたい。\`#[should_panic]\` を付けると、**panic したら成功、しなければ失敗** になる。

\`\`\`rust
#[test]
#[should_panic]
fn greater_than_100() {
    new_guess(200);
}
\`\`\`

panic のメッセージも確かめたいときは \`expected\` を付ける（メッセージの **部分一致**）。

\`\`\`rust
#[test]
#[should_panic(expected = "between 1 and 100")]
fn greater_than_100_message() {
    new_guess(200);
}
\`\`\`

\`expected\` がないと「別の理由で panic した」場合も成功してしまうので、付けるほうが確実。

## Result を返すテスト

テスト関数は \`Result<(), E>\` を返すこともできる。\`Err\` を返したら失敗。**\`?\` 演算子が使える** のが利点。

\`\`\`rust
#[test]
fn parses_config() -> Result<(), String> {
    let cfg = parse("port=8080")?;          // Err ならそこでテスト失敗
    if cfg.port == 8080 {
        Ok(())
    } else {
        Err(format!("port が違う: {}", cfg.port))
    }
}
\`\`\`

- Result を返すテストには \`#[should_panic]\` は付けられない
- 「Err になること」を確かめたいなら \`assert!(value.is_err())\` を使う

## テストの実行を制御する（cargo test のオプション）

\`cargo test\` の後ろの引数は 2 種類あり、\`--\` で区切る。\`--\` より前は cargo に、後はテストバイナリに渡る。

\`\`\`bash
cargo test                          # すべて実行
cargo test add                      # 名前に "add" を含むテストだけ（部分一致でフィルタ）
cargo test tests::adds_two_numbers  # 特定の 1 つ
cargo test -- --test-threads=1      # 並列にせず 1 スレッドで順に実行
cargo test -- --show-output         # 成功したテストの println! も表示
cargo test -- --ignored             # #[ignore] を付けたテストだけ実行
cargo test -- --include-ignored     # ignore も含めて全部
cargo test --test integration_test  # 特定の結合テストファイルだけ
cargo test --doc                    # ドキュメントテストだけ
\`\`\`

- 成功したテストの標準出力は **デフォルトでは隠される**（失敗したテストの出力だけ表示）
- テストは並列実行されるので、同じファイルや環境変数など **共有の状態に依存しない** ように書く。どうしても必要なら \`--test-threads=1\`
- 時間のかかるテストには \`#[ignore]\` を付けておき、必要なときだけ \`--ignored\` で実行する

\`\`\`rust
#[test]
#[ignore]
fn expensive_test() {
    // 1 時間かかるテスト
}
\`\`\`

## 単体テストと結合テスト

| | 単体テスト（unit test） | 結合テスト（integration test） |
|---|---|---|
| 場所 | \`src/\` の各ファイル内の \`#[cfg(test)] mod tests\` | プロジェクト直下の \`tests/\` ディレクトリ |
| 対象 | 1 つのモジュールを小さく・非公開関数も | ライブラリの **公開 API** を外部の利用者として |
| \`#[cfg(test)]\` | 必要 | 不要（\`tests/\` は \`cargo test\` のときだけコンパイルされる） |

\`\`\`text
adder/
├── Cargo.toml
├── src/
│   └── lib.rs
└── tests/
    ├── common/
    │   └── mod.rs          // 共通の補助関数（テストファイル扱いされない）
    └── integration_test.rs
\`\`\`

\`\`\`rust
// tests/integration_test.rs
use adder::add;  // 外部クレートとして自分のライブラリを使う

mod common;      // tests/common/mod.rs

#[test]
fn it_adds() {
    common::setup();
    assert_eq!(add(2, 2), 4);
}
\`\`\`

- \`tests/\` の各ファイルは **別々のクレート** としてコンパイルされる
- 補助関数は \`tests/common.rs\` ではなく \`tests/common/mod.rs\` に置く（\`tests/\` 直下のファイルはテストクレートとして扱われ、結果にも出てしまうため）
- **バイナリクレート（\`src/main.rs\` だけ）は結合テストから \`use\` できない**。そのためロジックは \`src/lib.rs\` に置き、\`main.rs\` は薄く呼び出すだけにするのが定番

## ドキュメントテスト

ドキュメントコメント（\`///\`）の中のコード例は、\`cargo test\` で **実際にコンパイル・実行される**。ドキュメントとコードがずれるのを防げる。

\`\`\`rust
/// 2 つの数を足す。
///
/// # Examples
///
/// \`\`\`
/// let result = my_crate::add(2, 3);
/// assert_eq!(result, 5);
/// \`\`\`
///
/// # Panics
///
/// オーバーフローしたとき（デバッグビルド）。
pub fn add(a: i32, b: i32) -> i32 {
    a + b
}
\`\`\`

\`\`\`text
   Doc-tests my_crate

running 1 test
test src/lib.rs - add (line 5) ... ok
\`\`\`

- コード例の中では \`assert_eq!\` で期待値を書いておく
- 行頭に \`# \` を付けた行は、テストでは実行されるがドキュメントには表示されない（準備コードを隠せる）
- コードブロックの言語名の位置に \`should_panic\`（panic すれば成功）、\`no_run\`（コンパイルだけ）、\`ignore\`（実行しない）などを書いて扱いを変えられる

## テストしやすいコードにするコツ

- 入出力（ファイル・標準入力・時刻）とロジックを分け、ロジックは **引数を受け取って値を返す純粋な関数** にする
- 外部とのやりとりはトレイトにしておき、テストではモック（29 章の \`RefCell\` を使った記録係など）を渡す
- 1 つのテストでは 1 つのことを確かめ、テスト名で「何を確かめるか」を表す（\`rejects_empty_name\` など）

## このサイトの採点との関係

このサイトの「書く」問題は、採点側が \`main\` を付け足して関数を呼び出し、結果を比べている。仕組みとしては \`assert_eq!\` を並べたテストと同じ。
\`#[cfg(test)] mod tests\` を書いても採点には影響しない（\`cargo test\` ではないのでコンパイルされない）が、手元で \`cargo test\` するときと同じ書き方で練習できる。`,
    hints: [
      "`#[test]` を付けた関数がテスト。panic したら失敗。`#[cfg(test)] mod tests { use super::*; }` に置くのが定番。",
      "`assert!` / `assert_eq!` / `assert_ne!`。比べる値は PartialEq と Debug が必要。後ろの引数でメッセージを付けられる。",
      '`#[should_panic(expected = "...")]` で panic を、`-> Result<(), E>` を返すテストで `?` を使える。',
      "単体テストは src 内、結合テストは tests/ ディレクトリ、ドキュメントテストは `///` のコード例。`cargo test 名前` で絞り込み。",
    ],
  },
  learn: {
    quiz: [
      {
        prompt: "テスト関数が「失敗」と判定されるのはどんなとき？",
        choices: [
          "関数の中で panic したとき",
          "false を返したとき",
          "println! したとき",
          "0 を返したとき",
        ],
        answer: "関数の中で panic したとき",
        explain: "assert! 系は条件が満たされないと panic する。panic せずに最後まで走れば成功。",
      },
      {
        prompt: "`#[cfg(test)]` の役割は？",
        choices: [
          "cargo test のときだけそのコードをコンパイルする",
          "そのテストを無視する",
          "テストを並列に実行する",
          "テストを結合テストにする",
        ],
        answer: "cargo test のときだけそのコードをコンパイルする",
        explain: "条件付きコンパイル。通常のビルドにはテストコードが含まれない。",
      },
      {
        prompt: "`assert_eq!(a, b)` で自作の構造体を比べるために必要なトレイトは？",
        choices: ["PartialEq と Debug", "Clone と Copy", "Display と Default", "Eq と Hash"],
        answer: "PartialEq と Debug",
        explain: "== で比べるのに PartialEq、失敗時に値を表示するのに Debug が必要。",
      },
      {
        prompt: "次のテストが成功する条件は？",
        snippet: `#[test]
#[should_panic(expected = "between 1 and 100")]
fn too_big() {
    new_guess(200);
}`,
        choices: [
          'new_guess(200) が "between 1 and 100" を含むメッセージで panic する',
          "new_guess(200) が panic しない",
          "new_guess(200) が Err を返す",
          "どんな panic でも成功",
        ],
        answer: 'new_guess(200) が "between 1 and 100" を含むメッセージで panic する',
        explain: "should_panic は panic したら成功。expected でメッセージを部分一致で確かめる。",
      },
      {
        prompt: "成功したテストの `println!` の出力も見たいときのコマンドは？",
        choices: [
          "cargo test -- --show-output",
          "cargo test --show-output",
          "cargo test --verbose-print",
          "cargo run --test",
        ],
        answer: "cargo test -- --show-output",
        explain:
          "-- の後ろはテストバイナリへの引数。デフォルトでは成功したテストの出力は隠される。",
      },
      {
        prompt: "結合テスト（integration test）を置く場所は？",
        choices: [
          "プロジェクト直下の tests/ ディレクトリ",
          "src/tests.rs",
          "src/main.rs の末尾",
          "Cargo.toml の [test] セクション",
        ],
        answer: "プロジェクト直下の tests/ ディレクトリ",
        explain:
          "tests/ の各ファイルは別のクレートとしてコンパイルされ、ライブラリの公開 API だけを使う。",
      },
      {
        prompt: "`Result<(), String>` を返すテストの利点は？",
        choices: [
          "テスト内で ? 演算子が使える",
          "panic しても成功になる",
          "並列実行されなくなる",
          "#[should_panic] と組み合わせられる",
        ],
        answer: "テスト内で ? 演算子が使える",
        explain: "Err を返すとテスト失敗。should_panic とは組み合わせられない。",
      },
      {
        prompt: "ドキュメントコメント `///` 内のコード例について正しいのは？",
        choices: [
          "cargo test でドキュメントテストとして実行される",
          "ドキュメントにだけ表示され、実行はされない",
          "コンパイルエラーがあっても無視される",
          "cargo doc のときだけ実行される",
        ],
        answer: "cargo test でドキュメントテストとして実行される",
        explain: "ドキュメントの例が古くなって動かなくなるのを防げる。",
      },
    ],
  },
});
