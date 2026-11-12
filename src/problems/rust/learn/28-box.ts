import { defineProblem } from "../../../core/schemas";

export default defineProblem({
  id: "rust-learn-box",
  stage: "learn",
  language: "rust",
  scenario: "rust",
  copy: {
    title: "Box<T> と再帰的な型",
    prompt: `## スマートポインタとは

**スマートポインタ** は「ポインタのように振る舞いつつ、追加の機能（自動解放・参照カウントなど）を持つ構造体」のこと。
実はもう使っている \`String\` や \`Vec<T>\` もスマートポインタの一種で、ヒープ上のデータを指し、スコープを抜けると自動で解放する。

この章から数章かけて、標準ライブラリの代表的なスマートポインタを学ぶ。

| 型 | 役割 | 章 |
|---|---|---|
| \`Box<T>\` | 値をヒープに置き、単一の所有者が持つ | この章 |
| \`Rc<T>\` | 参照カウントで所有者を複数にする | 29 章 |
| \`RefCell<T>\` | 不変参照越しの変更（内部可変性） | 29 章 |
| \`Weak<T>\` | 所有しない弱い参照（循環参照を断つ） | 29 章 |

スマートポインタらしさを生むのは 2 つのトレイト **\`Deref\`**（\`*\` で中身を取り出せる）と **\`Drop\`**（スコープを抜けたときの後始末）。これは 30 章で詳しく扱う。

## スタックとヒープのおさらい

- **スタック**: 関数の呼び出しごとに積まれる領域。サイズがコンパイル時に決まっている値（\`i32\`、\`[i32; 3]\`、構造体など）が置かれる。確保・解放がとても速い
- **ヒープ**: 実行時に必要なだけ確保する領域。サイズが後から変わる・コンパイル時に分からないデータを置く。確保はやや遅い

Rust では、**何も書かなければ値はスタックに置かれる**。ヒープに置きたいときに使う最も単純な道具が \`Box<T>\`。

## Box<T> の基本

\`\`\`rust
fn main() {
    let b = Box::new(5);      // 5 をヒープに置き、b はそのポインタを持つ
    println!("b = {}", b);    // Display は中身をそのまま表示: b = 5
    let x = *b + 1;           // * で参照外しすると中身の i32 が取れる
    println!("x = {}", x);    // x = 6
} // ここで b がスコープを抜け、ヒープの 5 も自動で解放される
\`\`\`

- \`Box::new(値)\` で値をヒープに移動し、\`Box\` 自体（ポインタ 1 個分）はスタックに置かれる
- \`*b\` で中身を取り出せる（\`Box\` が \`Deref\` を実装しているから）
- メソッド呼び出しは自動で参照外しされるので \`b.abs()\` のように中身のメソッドをそのまま呼べる
- \`Box\` は **所有者が 1 人** の普通の値。ムーブ・借用のルールは \`String\` と同じ
- スコープを抜けると **\`Box\` とヒープ上の中身の両方** が解放される（\`Drop\`）

JS ではオブジェクトは常にヒープに置かれ GC が回収するが、Rust では「ヒープに置くか」をプログラマが型で明示し、解放はスコープで決まる。

\`\`\`rust
let a = Box::new(String::from("hi"));
let b = a;               // 所有権がムーブ（ヒープのデータはコピーされない）
// println!("{}", a);    // エラー: a はムーブ済み
let c = b.clone();       // 中身ごと深いコピー
println!("{} {}", b, c);
\`\`\`

## Box を使う 3 つの場面

- **コンパイル時にサイズが決まらない型** を、サイズが決まっている必要がある場所で使いたいとき（再帰的な型）
- **大きなデータ** の所有権を、コピーせずに移したいとき（ムーブで動くのはポインタだけになる）
- **ある型であることより、あるトレイトを実装していること** だけが重要なとき（トレイトオブジェクト \`Box<dyn Trait>\`）

順に見ていこう。

## 再帰的な型とサイズ問題

関数型言語でおなじみの **コンスリスト（cons list）** を enum で書いてみる。「値と、残りのリスト」のペアを繋げたもの。

\`\`\`rust
enum List {
    Cons(i32, List), // エラー！
    Nil,
}
\`\`\`

これはコンパイルできない。

\`\`\`text
error[E0072]: recursive type \`List\` has infinite size
help: insert some indirection (e.g., a \`Box\`, \`Rc\`, or \`&\`) to break the cycle
\`\`\`

Rust は enum のサイズを「一番大きいバリアントのサイズ」として計算する。\`Cons\` は \`i32\` と \`List\` を含み、その \`List\` はまた \`i32\` と \`List\` を含み……と **無限に続く** ので、サイズが決まらない。

解決策はエラーメッセージの通り「間接参照（indirection）」を挟むこと。\`Box<List>\` は **中身が何であってもポインタ 1 個分のサイズ** なので、\`Cons\` のサイズが \`i32 + ポインタ\` に確定する。

\`\`\`rust
#[derive(Debug)]
enum List {
    Cons(i32, Box<List>),
    Nil,
}

use List::{Cons, Nil};

fn main() {
    // 1 -> 2 -> 3 -> Nil
    let list = Cons(1, Box::new(Cons(2, Box::new(Cons(3, Box::new(Nil))))));
    println!("{:?}", list); // Cons(1, Cons(2, Cons(3, Nil)))
}
\`\`\`

\`Box\` の Debug 表示は中身をそのまま表示するので、\`Box\` は見えない。

### 再帰関数で処理する

再帰的なデータは再帰関数で処理するのが自然。\`match\` でバリアントごとに分ける。

\`\`\`rust
fn len(list: &List) -> usize {
    match list {
        Cons(_, rest) => 1 + len(rest), // rest は &Box<List>。自動で &List として渡せる
        Nil => 0,
    }
}

fn sum(list: &List) -> i32 {
    match list {
        Cons(v, rest) => v + sum(rest),
        Nil => 0,
    }
}
\`\`\`

- \`&List\` を \`match\` すると、中の値は自動で参照として束縛される（\`v: &i32\`, \`rest: &Box<List>\`）
- \`&Box<List>\` は \`&List\` を受け取る関数にそのまま渡せる（**参照外し型強制 / deref coercion**、30 章）

ループで書くこともできる。

\`\`\`rust
fn len_loop(list: &List) -> usize {
    let mut cur = list;
    let mut n = 0;
    while let Cons(_, rest) = cur {
        n += 1;
        cur = rest; // &Box<List> → &List に自動変換
    }
    n
}
\`\`\`

### 二分木

木構造も再帰的な型の代表例。子が「ない」ことを表すために \`Option<Box<Node>>\` を使うのが定番。

\`\`\`rust
#[derive(Debug)]
struct Node {
    value: i32,
    left: Option<Box<Node>>,
    right: Option<Box<Node>>,
}

fn sum(node: &Option<Box<Node>>) -> i32 {
    match node {
        Some(n) => n.value + sum(&n.left) + sum(&n.right),
        None => 0,
    }
}
\`\`\`

\`Option<Box<T>>\` は **null 許容ポインタ** に相当する。しかも Rust は「\`Box\` は null にならない」ことを知っているので、\`None\` を null ポインタで表現する最適化を行い、\`Option<Box<T>>\` のサイズは \`Box<T>\` と同じ（ポインタ 1 個分）になる。

### 二分探索木への挿入（可変参照でたどる）

\`\`\`rust
fn insert(node: &mut Option<Box<Node>>, v: i32) {
    match node {
        None => {
            *node = Some(Box::new(Node { value: v, left: None, right: None }));
        }
        Some(n) => {
            if v < n.value {
                insert(&mut n.left, v);
            } else if v > n.value {
                insert(&mut n.right, v);
            } // 等しいときは何もしない
        }
    }
}
\`\`\`

- \`*node = ...\` で「今いる場所」を新しいノードに置き換える
- \`&mut Option<Box<Node>>\` を引数にすると、「子の場所」をそのまま渡して再帰できる

別の表現として、enum で木を書く方法もある。

\`\`\`rust
enum Tree {
    Leaf,
    Node(Box<Tree>, i32, Box<Tree>),
}
\`\`\`

## 式の木（AST）

コンパイラや電卓で使う **抽象構文木** も Box の出番。

\`\`\`rust
enum Expr {
    Num(i64),
    Add(Box<Expr>, Box<Expr>),
    Mul(Box<Expr>, Box<Expr>),
}

fn eval(e: &Expr) -> i64 {
    match e {
        Expr::Num(n) => *n,
        Expr::Add(a, b) => eval(a) + eval(b),
        Expr::Mul(a, b) => eval(a) * eval(b),
    }
}

// (1 + 2) * 3
let e = Expr::Mul(
    Box::new(Expr::Add(Box::new(Expr::Num(1)), Box::new(Expr::Num(2)))),
    Box::new(Expr::Num(3)),
);
assert_eq!(eval(&e), 9);
\`\`\`

## Box から中身を取り出す

\`*\` で参照外しすると、\`Box\` から中身を **ムーブして取り出せる**（\`Box\` だけの特別な機能）。

\`\`\`rust
let b = Box::new(String::from("hello"));
let s: String = *b; // Box を消費して中の String を取り出す
println!("{}", s);
\`\`\`

\`match\` で \`Box\` の中身を所有権ごと分解したいときも、\`*boxed\` を使う。

\`\`\`rust
fn into_vec(list: List) -> Vec<i32> {
    match list {
        Cons(v, rest) => {
            let mut out = vec![v];
            out.extend(into_vec(*rest)); // *rest で Box<List> → List
            out
        }
        Nil => vec![],
    }
}
\`\`\`

## Box<dyn Trait>（トレイトオブジェクト）

「違う型だけど同じトレイトを実装している値」をひとまとめに扱いたいとき、\`Box<dyn Trait>\` を使う。
\`dyn Trait\` はサイズが型ごとに違う（コンパイル時に決まらない）ので、そのままでは変数や Vec に入れられない。Box で包むとポインタ 1 個（＋メソッド表へのポインタ）の固定サイズになる。

\`\`\`rust
trait Animal {
    fn speak(&self) -> String;
}

struct Dog;
struct Cat;

impl Animal for Dog {
    fn speak(&self) -> String { String::from("ワン") }
}
impl Animal for Cat {
    fn speak(&self) -> String { String::from("ニャー") }
}

// 実行時の条件で「違う型」を返せる
fn make(kind: &str) -> Box<dyn Animal> {
    if kind == "dog" { Box::new(Dog) } else { Box::new(Cat) }
}

fn main() {
    let zoo: Vec<Box<dyn Animal>> = vec![Box::new(Dog), Box::new(Cat), make("dog")];
    for a in &zoo {
        println!("{}", a.speak()); // 実行時に、中身の型の speak が呼ばれる
    }
}
\`\`\`

- \`Box<Dog>\` は \`Box<dyn Animal>\` に自動で変換される（\`Dog: Animal\` だから）
- 戻り値の型を \`impl Animal\` にすると「1 種類の型」しか返せないが、\`Box<dyn Animal>\` なら条件で型を変えられる
- 詳しい仕組み（動的ディスパッチ、オブジェクト安全性）は 31 章で扱う

## 大きなデータのムーブ

\`\`\`rust
let big = Box::new([0u8; 1_000_000]); // 1MB の配列をヒープに
let moved = big; // ムーブで動くのはポインタ（8 バイト）だけ
\`\`\`

配列をそのままムーブするとスタック上で 1MB のコピーが起きうるが、Box ならポインタだけ。スタックあふれ（stack overflow）を避ける目的でも使われる。

## まとめ

| やりたいこと | 書き方 |
|---|---|
| 値をヒープに置く | \`Box::new(v)\` |
| 中身を使う | \`*b\`、またはメソッドを直接 \`b.method()\` |
| 中身を取り出す | \`let v = *b;\` |
| 再帰的な型 | \`enum List { Cons(i32, Box<List>), Nil }\` |
| 子がいないかもしれない木 | \`Option<Box<Node>>\` |
| 異なる型をまとめる | \`Vec<Box<dyn Trait>>\` |`,
    hints: [
      "`Box<T>` は値をヒープに置く、所有者 1 人のスマートポインタ。スコープを抜けると中身ごと解放される。",
      "再帰的な型はサイズが無限になるので、`Box` で間接参照を挟んでサイズを確定させる。",
      "木構造では `Option<Box<Node>>` で「子がいない」を表すのが定番。",
      "`Box<dyn Trait>` で、違う型を同じトレイトとしてまとめて扱える。",
    ],
  },
  learn: {
    quiz: [
      {
        prompt: "次のコードがコンパイルエラーになる理由は？",
        snippet: `enum List {
    Cons(i32, List),
    Nil,
}`,
        choices: [
          "型のサイズが無限になり、コンパイル時に決まらないから",
          "enum に i32 は入れられないから",
          "Nil に値がないから",
          "derive(Debug) がないから",
        ],
        answer: "型のサイズが無限になり、コンパイル時に決まらないから",
        explain:
          "List の中に List がそのまま入ると、サイズの計算が無限に続く（E0072）。Box<List> にすればポインタ 1 個分に確定する。",
      },
      {
        prompt: "`let b = Box::new(5);` のとき、`5` が置かれる場所は？",
        choices: ["ヒープ", "スタック", "静的領域", "レジスタのみ"],
        answer: "ヒープ",
        explain: "Box::new は値をヒープに確保する。Box 自体（ポインタ）はスタックに置かれる。",
      },
      {
        prompt: "次のコードの出力は？",
        snippet: `let b = Box::new(10);
let c = *b * 2;
println!("{}", c);`,
        choices: ["20", "10", "コンパイルエラー", "アドレスが表示される"],
        answer: "20",
        explain: "*b で中身の 10 を取り出して 2 倍する。",
      },
      {
        prompt:
          "二分木の子ノード「あるかもしれないし、ないかもしれない」を表す型として定番なのは？",
        choices: ["Option<Box<Node>>", "Box<Option<i32>>", "Vec<Node>", "&Node"],
        answer: "Option<Box<Node>>",
        explain:
          "None が「子なし」、Some(Box<Node>) が「子あり」。サイズもポインタ 1 個分に最適化される。",
      },
      {
        prompt: "`Vec<Box<dyn Animal>>` を使う主な理由は？",
        choices: [
          "Animal を実装した異なる型の値を 1 つの Vec にまとめるため",
          "Vec を速くするため",
          "Animal をコピー可能にするため",
          "Animal を不変にするため",
        ],
        answer: "Animal を実装した異なる型の値を 1 つの Vec にまとめるため",
        explain:
          "dyn Animal はサイズが型ごとに異なるので直接は入れられない。Box で包めば固定サイズになり、異なる型を混ぜられる。",
      },
      {
        prompt: "Box がスコープを抜けたときに起きることは？",
        choices: [
          "Box とヒープ上の中身の両方が解放される",
          "Box だけ解放され、中身はリークする",
          "GC が後で回収する",
          "何も起きない",
        ],
        answer: "Box とヒープ上の中身の両方が解放される",
        explain: "Box は Drop を実装していて、スコープ終了時にヒープの中身も解放する。",
      },
      {
        prompt: "`let s: String = *boxed_string;` について正しいのは？",
        choices: [
          "Box を消費して中の String をムーブで取り出す",
          "String をコピーする",
          "コンパイルエラーになる",
          "Box のアドレスを取り出す",
        ],
        answer: "Box を消費して中の String をムーブで取り出す",
        explain:
          "Box は * で中身をムーブアウトできる特別なスマートポインタ。取り出した後 boxed_string は使えない。",
      },
    ],
  },
});
