import { defineProblem } from "../../../core/schemas";

export default defineProblem({
  id: "rust-learn-macros",
  stage: "learn",
  language: "rust",
  scenario: "rust",
  copy: {
    title: "マクロ（macro_rules! と標準マクロ）",
    prompt: `## マクロとは

マクロは **コードを生成するコード**。\`println!\` や \`vec!\` のように名前の後ろに \`!\` が付く。関数との違いは次の通り。

| | 関数 | マクロ |
|---|---|---|
| いつ動く | 実行時 | **コンパイル時**（コードに展開される） |
| 引数の数 | 固定 | 可変にできる（\`println!("{} {}", a, b)\`） |
| 受け取るもの | 値 | **コードの断片**（式・識別子・型など） |
| できること | 計算 | 関数や構造体の定義を生成する、など |
| 欠点 | - | 読みにくい・エラーが分かりにくい |

「関数で書けるなら関数で書く。関数では無理なときだけマクロ」が基本方針。

## 宣言的マクロ macro_rules!

パターンにマッチさせてコードを置き換える。\`match\` 式のコード版だと考えるとよい。

\`\`\`rust
macro_rules! say_hello {
    () => {
        println!("Hello!");
    };
}

macro_rules! square {
    ($x:expr) => {
        $x * $x
    };
}

fn main() {
    say_hello!();             // println!("Hello!"); に展開される
    println!("{}", square!(4)); // 4 * 4 → 16
}
\`\`\`

- \`( パターン ) => { 展開後のコード };\` を「腕」と呼び、複数書ける（上から順にマッチを試す）
- \`$x:expr\` は「式にマッチして、それを \`$x\` と呼ぶ」という意味
- マクロは呼び出し **より前** に定義する必要がある（ファイルの上から順に読まれる）
- 呼び出しは \`square!(4)\` \`square![4]\` \`square!{4}\` のどの括弧でもよい（\`vec![]\` は慣習で角括弧）

### 落とし穴: 演算子の優先順位

\`\`\`rust
macro_rules! square_bad {
    ($x:expr) => { $x * $x };
}
// square_bad!(1 + 2) はどうなる？
\`\`\`

C のマクロ（文字列置換）だと \`1 + 2 * 1 + 2 = 5\` になってしまうが、Rust の \`expr\` は **1 つの式のかたまり** として扱われるので、ちゃんと \`(1 + 2) * (1 + 2) = 9\` になる。とはいえ意図を明確にするため \`($x) * ($x)\` と書く人も多い。また \`$x\` を 2 回書くと **式が 2 回評価される**（\`square!(next())\` で \`next\` が 2 回呼ばれる）ことには注意。気になるなら \`{ let v = $x; v * v }\` とする。

## フラグメント指定子

| 指定子 | マッチするもの | 例 |
|---|---|---|
| \`expr\` | 式 | \`1 + 2\`, \`foo()\`, \`x\` |
| \`ident\` | 識別子（名前） | \`my_func\`, \`x\`, \`Point\` |
| \`ty\` | 型 | \`i32\`, \`Vec<String>\` |
| \`tt\` | トークン木 1 つ（何でも） | \`+\`, \`x\`, \`( ... )\` |
| \`literal\` | リテラル | \`42\`, \`"abc"\` |
| \`pat\` | パターン | \`Some(x)\`, \`1..=5\` |
| \`block\` | ブロック | \`{ ... }\` |
| \`stmt\` | 文 | \`let x = 1\` |
| \`path\` | パス | \`std::mem::swap\` |
| \`item\` | アイテム（関数・構造体など） | \`fn f() {}\` |

\`\`\`rust
// ident で関数名を受け取り、関数そのものを生成する
macro_rules! make_getter {
    ($name:ident, $value:expr) => {
        fn $name() -> i32 {
            $value
        }
    };
}
make_getter!(answer, 42);
// fn answer() -> i32 { 42 } が生成される

// ty で型を受け取る
macro_rules! zero_of {
    ($t:ty) => {
        <$t>::default()
    };
}
let z: f64 = zero_of!(f64); // 0.0
\`\`\`

## 繰り返し $( ... ),*

可変個の引数は **繰り返しパターン** で受け取る。

| 書き方 | 意味 |
|---|---|
| \`$( ... ),*\` | カンマ区切りで 0 回以上 |
| \`$( ... ),+\` | カンマ区切りで 1 回以上 |
| \`$( ... );*\` | セミコロン区切りで 0 回以上 |
| \`$( ... )*\` | 区切りなしで 0 回以上 |
| \`$( ... )?\` | 0 回か 1 回 |

\`\`\`rust
macro_rules! my_vec {
    ( $( $x:expr ),* $(,)? ) => {   // $(,)? で末尾カンマを許す
        {
            let mut v = Vec::new();
            $( v.push($x); )*        // マッチした回数だけ繰り返して展開
            v
        }
    };
}

let v = my_vec![1, 2, 3,];
// { let mut v = Vec::new(); v.push(1); v.push(2); v.push(3); v } に展開
\`\`\`

- 展開側でも \`$( ... )*\` と書くと、マッチした回数だけ中身が繰り返される
- 展開結果を \`{ }\` で囲んで **1 つのブロック式** にしておくと、どこで使っても安全

### 再帰するマクロ

\`\`\`rust
macro_rules! max {
    ($x:expr) => { $x };
    ($x:expr, $($rest:expr),+) => {
        { let a = $x; let b = max!($($rest),+); if a > b { a } else { b } }
    };
}
println!("{}", max!(3, 9, 2)); // 9
\`\`\`

## 衛生性（hygiene）

マクロの中で作った変数は、呼び出し側の同じ名前の変数とぶつからない。

\`\`\`rust
macro_rules! double {
    ($e:expr) => {{ let x = $e; x * 2 }};
}
let x = 10;
println!("{}", double!(x + 1)); // 22（マクロ内の x と外の x は別物）
\`\`\`

C のマクロのような「名前の衝突事故」が起きにくい。

## よく使う標準マクロ

| マクロ | 用途 |
|---|---|
| \`println!\` / \`format!\` / \`write!\` | 書式付き出力・文字列生成 |
| \`vec![1, 2, 3]\` / \`vec![0; 5]\` | Vec の生成（\`[値; 個数]\` で同じ値を並べる） |
| \`assert!(条件)\` | 条件が false なら panic。\`assert!(x > 0, "x={x}")\` とメッセージも付けられる |
| \`assert_eq!(a, b)\` / \`assert_ne!\` | 等しい / 等しくないことを確認。失敗時に両方の値を表示 |
| \`debug_assert!\` | デバッグビルドのときだけ確認（リリースでは消える） |
| \`matches!(値, パターン)\` | パターンにマッチするかを \`bool\` で返す |
| \`todo!()\` | 未実装の印。呼ばれると panic。どんな型の場所にも置ける |
| \`unimplemented!()\` | 実装しない予定の印（todo! と似ている） |
| \`unreachable!()\` | 「ここには来ないはず」の印。来たら panic |
| \`panic!("...")\` | 意図的に異常終了 |
| \`dbg!(式)\` | 式・値・ファイル名・行番号を標準エラーに出し、**値をそのまま返す** |
| \`include_str!("file.txt")\` | コンパイル時にファイルの中身を \`&'static str\` として埋め込む |
| \`env!("CARGO_PKG_VERSION")\` | コンパイル時の環境変数 |

\`\`\`rust
fn is_vowel(c: char) -> bool {
    matches!(c, 'a' | 'e' | 'i' | 'o' | 'u')
}

fn sign(n: i32) -> &'static str {
    match n.signum() {
        1 => "正",
        -1 => "負",
        0 => "ゼロ",
        _ => unreachable!(), // signum は 1, -1, 0 しか返さない
    }
}

fn main() {
    let a = 2;
    let b = dbg!(a * 3) + 1; // [src/main.rs:16:13] a * 3 = 6 と表示され、b = 7
    assert_eq!(b, 7);
    assert!(matches!(Some(5), Some(n) if n > 3)); // ガードも書ける
}
\`\`\`

\`todo!()\` が「どんな型の場所にも置ける」のは、戻り値の型が **\`!\`（never 型）**、つまり「決して戻ってこない」型だから。\`!\` はどんな型にもなれる。

## 手続き型マクロ（概要）

\`macro_rules!\` より強力で、**Rust のコードで Rust のコードを生成する** マクロ。専用のクレート（\`proc-macro = true\`）に書く必要がある。3 種類ある。

| 種類 | 見た目 | 例 |
|---|---|---|
| derive マクロ | \`#[derive(Name)]\` | \`#[derive(Debug, Clone, Serialize)]\` |
| 属性マクロ | \`#[name]\` を関数などに付ける | \`#[tokio::main]\`, \`#[test]\` 風のもの |
| 関数風マクロ | \`name!(...)\` | \`sqlx::query!(...)\`, \`html! { ... }\` |

\`\`\`rust
// 手続き型マクロの中身（イメージ。別クレートに置く）
use proc_macro::TokenStream;

#[proc_macro_derive(Hello)]
pub fn hello_derive(input: TokenStream) -> TokenStream {
    // input（構造体の定義）を解析し、impl Hello for ... のコードを返す
    // 実際は syn（解析）と quote（生成）クレートを使うのが定番
    todo!()
}
\`\`\`

- 入力も出力も **トークン列（\`TokenStream\`）**。構文木を自由に解析・生成できる
- \`serde\` の \`#[derive(Serialize, Deserialize)]\` は、構造体のフィールドを見て変換コードを自動生成している
- 自分で書く機会は少ないが、「\`#[derive(...)]\` の裏で impl が生成されている」ことを知っておくと、エラーメッセージが読みやすくなる

## マクロの展開結果を見る

\`cargo install cargo-expand\` を入れると、\`cargo expand\` でマクロ展開後のコードを確認できる。\`println!\` が何に展開されるかを見ると面白い。`,
    hints: [
      "`macro_rules!` はパターン `($x:expr) => { ... }` でコードを置き換える。コンパイル時に展開される。",
      "フラグメント指定子: `expr`（式）`ident`（名前）`ty`（型）`tt`（何でも 1 トークン木）。",
      "`$( $x:expr ),*` で可変個を受け取り、展開側の `$( ... )*` で同じ回数繰り返す。",
      "`matches!` / `assert!` / `todo!` / `unreachable!` / `dbg!` は日常的に使う標準マクロ。",
    ],
  },
  learn: {
    quiz: [
      {
        prompt: "マクロが関数と違う点として正しいものは？",
        choices: [
          "コンパイル時にコードとして展開される",
          "実行時に呼び出される",
          "引数の型が必ず決まっている",
          "戻り値を返せない",
        ],
        answer: "コンパイル時にコードとして展開される",
        explain:
          "マクロはコンパイル時にコードを生成する。そのため可変個の引数や関数定義の生成ができる。",
      },
      {
        prompt: "関数名を受け取って関数を生成したい。使うフラグメント指定子は？",
        snippet: `macro_rules! make_fn {
    ($name:???) => { fn $name() {} };
}`,
        choices: ["ident", "expr", "ty", "literal"],
        answer: "ident",
        explain: "識別子（名前）は `ident`。`expr` だと式として扱われ、関数名の位置には置けない。",
      },
      {
        prompt: "`$( $x:expr ),*` がマッチするのは？",
        choices: [
          "カンマ区切りの 0 個以上の式",
          "カンマ区切りの 1 個以上の式",
          "ちょうど 1 つの式",
          "セミコロン区切りの式",
        ],
        answer: "カンマ区切りの 0 個以上の式",
        explain: "`*` は 0 回以上、`+` は 1 回以上、`?` は 0 か 1 回。",
      },
      {
        prompt: "`matches!(x, Some(1..=5))` の戻り値の型は？",
        choices: ["bool", "Option<i32>", "()", "Result<(), ()>"],
        answer: "bool",
        explain: "matches! はパターンにマッチするかどうかを bool で返す。",
      },
      {
        prompt: "`let y = dbg!(2 + 3);` の後の y の値は？",
        choices: ["5", "()", '"2 + 3 = 5"', "コンパイルエラー"],
        answer: "5",
        explain: "dbg! は式と値を標準エラーに表示し、値をそのまま返す。",
      },
      {
        prompt: "`todo!()` を戻り値が `String` の関数の中に置いてもコンパイルが通る理由は？",
        choices: [
          "todo! の型は決して戻らない ! 型で、どんな型にもなれるから",
          "todo! が空の String を返すから",
          "コンパイラが todo! を無視するから",
          "警告に格下げされるから",
        ],
        answer: "todo! の型は決して戻らない ! 型で、どんな型にもなれるから",
        explain: "panic する式の型は never 型 `!`。どんな型の位置にも置ける。",
      },
      {
        prompt: "`#[derive(Debug)]` は何の一種？",
        choices: [
          "手続き型マクロ（derive マクロ）",
          "宣言的マクロ",
          "トレイトオブジェクト",
          "コンパイラのオプション",
        ],
        answer: "手続き型マクロ（derive マクロ）",
        explain: "derive は手続き型マクロの一種で、構造体の定義から impl を自動生成する。",
      },
    ],
  },
});
