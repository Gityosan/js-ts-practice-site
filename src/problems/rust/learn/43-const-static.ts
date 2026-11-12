import { defineProblem } from "../../../core/schemas";

export default defineProblem({
  id: "rust-learn-const-static",
  stage: "learn",
  language: "rust",
  scenario: "rust",
  copy: {
    title: "const / static / const fn",
    prompt: `## 3 種類の「変わらない値」

Rust には、変わらない値を表す書き方が 3 つある。

| | \`let\`（不変変数） | \`const\`（定数） | \`static\`（静的変数） |
|---|---|---|---|
| 値が決まる時 | 実行時 | **コンパイル時** | **コンパイル時** |
| 型注釈 | 省略可 | **必須** | **必須** |
| 書ける場所 | 関数の中 | どこでも（トップレベル可） | どこでも（トップレベル可） |
| メモリ上の実体 | スタックなど | なし（使う場所に **埋め込まれる**） | **1 つだけ** 固定の場所にある |
| 寿命 | スコープの間 | - | プログラム全体（\`'static\`） |
| 名前の慣習 | \`snake_case\` | \`SCREAMING_SNAKE_CASE\` | \`SCREAMING_SNAKE_CASE\` |
| 変更 | \`let mut\` で可 | 不可 | \`static mut\`（unsafe）か内部可変性 |

## let の不変変数と const の違い

\`\`\`rust
const MAX_POINTS: u32 = 100_000;     // コンパイル時に決まる定数

fn read_number() -> u32 {
    21 // 本当はユーザー入力などから読む
}

fn main() {
    let input = read_number();       // 実行時に決まる値 → let でしか持てない
    let doubled = input * 2;         // 不変だが、値は実行するまで分からない
    // const C: u32 = input;         // エラー: const にはコンパイル時に計算できる値しか置けない
    println!("{}", MAX_POINTS);
}
\`\`\`

- \`let\` の不変は「**この変数を後から書き換えない**」という約束。値自体は実行時に計算してよい
- \`const\` は「**コンパイル時に値が確定している**」もの。プログラム中で使われる場所ごとに値が埋め込まれる（C の \`#define\` に近いが、型がある）
- \`const\` には型注釈が必須（\`const N = 5;\` はエラー）。型推論しないのは、定数は API の一部として型を明示すべきという設計
- 同じ名前で再宣言する **シャドーイングは \`let\` だけ** の機能

## const の使いどころ

\`\`\`rust
const SECONDS_PER_HOUR: u64 = 60 * 60;       // 計算式も書ける（定数式）
const GREETING: &str = "こんにちは";          // 文字列リテラル（&'static str）
const PRIMES: [u32; 5] = [2, 3, 5, 7, 11];  // 配列
const ORIGIN: Point = Point { x: 0, y: 0 }; // 構造体も OK

struct Point { x: i32, y: i32 }

impl Point {
    const UNIT: Point = Point { x: 1, y: 1 }; // 関連定数（型にひも付く定数）
}

fn main() {
    let arr = [0u8; SECONDS_PER_HOUR as usize / 60]; // 配列の長さにも使える（コンパイル時の値なので）
    println!("{} {}", arr.len(), Point::UNIT.x);
    println!("{}", u32::MAX);                  // 標準の関連定数
    println!("{}", std::f64::consts::PI);      // 標準の定数
}
\`\`\`

- 配列の長さ \`[T; N]\` や、ジェネリクスの const 引数など、**コンパイル時に値が必要な場所** で使える
- マジックナンバーに名前を付けて、意味を明確にする
- \`const\` で置いた値は使う場所ごとにコピーされるので、\`const\` の配列を \`&\` で参照するとそのたびに別の一時値を指しうる（同一性が必要なら \`static\`）

## static: プログラム全体で 1 つだけの値

\`\`\`rust
static APP_NAME: &str = "MyApp";
static LOOKUP: [u8; 4] = [10, 20, 30, 40];

fn main() {
    println!("{APP_NAME}");
    let r: &'static [u8; 4] = &LOOKUP; // static への参照は 'static
    println!("{:?}", r);
}
\`\`\`

- \`static\` は **メモリ上の固定アドレスに 1 つだけ** 存在する。どこから参照しても同じ場所
- プログラムの開始から終了まで生きているので、参照のライフタイムは **\`'static\`**
- 中身は \`Sync\`（スレッド間で共有して安全）である必要がある。どのスレッドからでも見えるから
- 大きなテーブルを 1 か所に置きたいとき、アドレスの同一性が必要なときに使う

### 書き換えたいときは内部可変性

\`static mut\` は読み書きに \`unsafe\` が必要で、データ競合の危険がある（edition 2024 では参照を取ること自体が禁止）。代わりに **アトミック型** や **\`Mutex\`** を \`static\` に置く。

\`\`\`rust
use std::sync::atomic::{AtomicU64, Ordering};
use std::sync::Mutex;

static REQUEST_COUNT: AtomicU64 = AtomicU64::new(0);
static LOG: Mutex<Vec<String>> = Mutex::new(Vec::new()); // Mutex::new は const fn

fn handle() {
    REQUEST_COUNT.fetch_add(1, Ordering::Relaxed);
    LOG.lock().unwrap().push(String::from("handled"));
}
\`\`\`

実行時にしか作れない値（\`HashMap\` や設定ファイルの中身など）は、\`std::sync::LazyLock\`（最初に使ったときに初期化）や \`OnceLock\` を使う。

\`\`\`rust
use std::collections::HashMap;
use std::sync::LazyLock;

static TABLE: LazyLock<HashMap<&str, u32>> = LazyLock::new(|| {
    let mut m = HashMap::new();
    m.insert("one", 1);
    m.insert("two", 2);
    m
});

fn main() {
    println!("{:?}", TABLE.get("two")); // Some(2)。最初のアクセスで初期化される
}
\`\`\`

## 'static ライフタイム

\`'static\` は「**プログラムが終わるまで有効**」という意味のライフタイム。

\`\`\`rust
let s: &'static str = "hello"; // 文字列リテラルはバイナリに埋め込まれている → 'static
\`\`\`

- 文字列リテラル、\`static\` 変数への参照は \`&'static\`
- \`T: 'static\` という **トレイト境界** は少し意味が違い、「\`T\` が短命な参照を含まない」ことを表す。\`String\` や \`i32\` のように所有するデータだけの型は \`'static\` を満たす（\`thread::spawn\` の要件がこれ）
- \`Box::leak\` で、実行時に作った値を意図的にリークさせて \`&'static\` を得ることもできる（めったに使わない）

## const fn: コンパイル時にも呼べる関数

\`const fn\` を付けた関数は、**定数式の中で呼べる**（コンパイル時に計算される）。普通に実行時に呼ぶこともできる。

\`\`\`rust
const fn square(x: u32) -> u32 {
    x * x
}

const fn factorial(n: u64) -> u64 {
    let mut acc = 1;
    let mut i = 2;
    while i <= n {     // const fn の中では for は使えない（イテレータが const でない）。while で書く
        acc *= i;
        i += 1;
    }
    acc
}

const AREA: u32 = square(12);          // コンパイル時に 144 と計算される
const FACT_10: u64 = factorial(10);    // 3628800
static TABLE: [u32; 4] = [square(1), square(2), square(3), square(4)];

fn main() {
    let n = 7;
    println!("{}", square(n));         // 実行時にも普通に呼べる
}
\`\`\`

const fn の中で使えるもの / 使えないもの（Rust のバージョンとともに増えている）:

| 使える | 使えない（現時点） |
|---|---|
| 算術・比較・\`if\` / \`match\` / \`loop\` / \`while\` | \`for\` ループ（イテレータ） |
| \`let mut\` とローカル変数の変更 | ヒープ確保（\`Vec::new\` 以外の \`push\` など）、\`String\` の操作 |
| 他の \`const fn\` の呼び出し | 普通の（const でない）関数・トレイトメソッドの呼び出し |
| 構造体・配列・タプルの作成 | 浮動小数点の一部の操作（多くは使えるようになってきた） |
| \`panic!\` / \`assert!\`（コンパイル時エラーになる） | 入出力 |

- コンパイル時に \`panic!\` すると **コンパイルエラー** になる。不正な定数を作らせない仕組みに使える
- 標準ライブラリにも \`const fn\` は多い（\`u32::pow\`, \`Vec::new\`, \`Mutex::new\`, \`Option::is_some\` など）

## const ブロックと定数式

\`\`\`rust
fn main() {
    let v = const { 1 << 10 };            // その場でコンパイル時評価を強制する
    let arr = [const { String::new() }; 3]; // Copy でない型の配列初期化にも使える
    println!("{v} {:?}", arr);
}
\`\`\`

\`const { ... }\` ブロックは、中身をコンパイル時に評価することを保証する（Rust 1.79 で安定化）。

## const ジェネリクス（ちょっとだけ）

\`\`\`rust
fn sum<const N: usize>(arr: [i32; N]) -> i32 {
    arr.iter().sum()
}
sum([1, 2, 3]);    // N = 3
sum([1, 2, 3, 4]); // N = 4
\`\`\`

型だけでなく **値（コンパイル時定数）** をジェネリクスの引数にできる。配列の長さを扱うときに便利。

## 使い分けのまとめ

- 関数の中で値に名前を付ける → \`let\`
- コンパイル時に決まる値に名前を付ける（上限値・設定値・変換係数） → \`const\`
- プログラム全体で 1 つの実体を共有したい（大きなテーブル、グローバルカウンタ） → \`static\`（変更するならアトミック型か \`Mutex\`）
- 実行時に初期化したいグローバル値 → \`static\` + \`LazyLock\` / \`OnceLock\`
- 定数を計算で作りたい → \`const fn\``,
    hints: [
      "`let` は実行時の値でもよい不変変数、`const` はコンパイル時に決まり使う場所に埋め込まれる定数。",
      "`static` はメモリ上に 1 つだけ存在し、参照は `'static`。変更したいならアトミック型や `Mutex` を置く。",
      "`const fn` は定数式の中で呼べる関数。中では `for` が使えないので `while` で書く。",
      "`const` / `static` は型注釈が必須で、名前は `SCREAMING_SNAKE_CASE`。",
    ],
  },
  learn: {
    quiz: [
      {
        prompt: "`const` についての説明で正しいものは？",
        choices: [
          "コンパイル時に値が決まり、型注釈が必須",
          "実行時に値を計算できる",
          "型推論されるので型注釈は不要",
          "関数の中でしか宣言できない",
        ],
        answer: "コンパイル時に値が決まり、型注釈が必須",
        explain: "const はコンパイル時定数。型は必ず書く。",
      },
      {
        prompt: "次のうちコンパイルエラーになるのは？",
        snippet: `fn get() -> u32 { 5 }`,
        choices: [
          "const N: u32 = get();",
          "const N: u32 = 2 + 3;",
          "let n = get();",
          "const N: u32 = u32::MAX / 2;",
        ],
        answer: "const N: u32 = get();",
        explain:
          "get は const fn ではないので、定数式の中では呼べない。`const fn get()` にすれば OK。",
      },
      {
        prompt: "`static` と `const` の違いとして正しいものは？",
        choices: [
          "static はメモリ上に 1 つの実体があり、const は使う場所に値が埋め込まれる",
          "static は型注釈が要らない",
          "const は書き換えられる",
          "static は関数の中でしか使えない",
        ],
        answer: "static はメモリ上に 1 つの実体があり、const は使う場所に値が埋め込まれる",
        explain: "static は固定アドレスを持ち、参照は 'static。const はインライン展開される。",
      },
      {
        prompt: '文字列リテラル `"hello"` の型は？',
        choices: ["&'static str", "String", "&'a str（任意のライフタイム）", "str"],
        answer: "&'static str",
        explain: "文字列リテラルはバイナリに埋め込まれ、プログラム終了まで有効。",
      },
      {
        prompt: "グローバルなカウンタを安全に書き換えたい。良い方法は？",
        choices: [
          "static COUNT: AtomicUsize = AtomicUsize::new(0);",
          "static mut COUNT: usize = 0;",
          "const mut COUNT: usize = 0;",
          "let mut COUNT: usize = 0; をトップレベルに書く",
        ],
        answer: "static COUNT: AtomicUsize = AtomicUsize::new(0);",
        explain:
          "static mut は unsafe でデータ競合の危険がある。アトミック型なら &self で安全に変更できる。",
      },
      {
        prompt: "`const fn` の中で使えないものは？",
        choices: ["for ループ", "while ループ", "if 式", "他の const fn の呼び出し"],
        answer: "for ループ",
        explain:
          "for はイテレータ（トレイトメソッド）を使うので const fn の中では使えない。while で書く。",
      },
      {
        prompt: "実行時にしか作れない HashMap をグローバルに置くには？",
        choices: [
          "static + LazyLock を使う",
          "const にする",
          "static mut にして main で代入する",
          "置く方法はない",
        ],
        answer: "static + LazyLock を使う",
        explain: "LazyLock は最初にアクセスされたときにクロージャを実行して初期化する。",
      },
    ],
  },
});
