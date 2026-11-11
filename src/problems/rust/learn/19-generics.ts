import { defineProblem } from "../../../core/schemas";

export default defineProblem({
  id: "rust-learn-generics",
  stage: "learn",
  language: "rust",
  scenario: "rust",
  copy: {
    title: "ジェネリクス（型をパラメータにする）",
    prompt: `## なぜジェネリクスが要るのか

「スライスの最大値を返す関数」を書くとき、\`i32\` 用・\`f64\` 用・\`char\` 用…と型ごとに同じ処理を書くのはつらい。

\`\`\`rust
fn largest_i32(list: &[i32]) -> i32 { /* ... */ }
fn largest_f64(list: &[f64]) -> f64 { /* 中身はまったく同じ */ }
fn largest_char(list: &[char]) -> char { /* これも同じ */ }
\`\`\`

**ジェネリクス（generics）** は「型そのものを引数にする」仕組み。型を \`T\` のような **型パラメータ** で表して、1 つの定義を色々な型で使い回せる。

JS は動的型付けなので何でも渡せるが、間違った型を渡すと実行時に壊れる。TypeScript の \`function f<T>(x: T)\` に近いのが Rust のジェネリクスだが、Rust では **「T に何ができるか」をトレイト境界で必ず宣言する** 点が大きく違う（次章で詳しく）。

## 関数のジェネリクス

関数名の後ろの \`<T>\` で型パラメータを宣言し、引数や戻り値の型として使う。

\`\`\`rust
fn first<T>(list: &[T]) -> &T {
    &list[0]
}

fn main() {
    let nums = [10, 20, 30];
    let words = ["a", "b"];
    println!("{}", first(&nums));  // 10（T = i32）
    println!("{}", first(&words)); // a （T = &str）
}
\`\`\`

- \`T\` は慣習的な名前（Type の T）。\`U\`, \`K\`, \`V\`（key / value）なども使う
- 呼び出し側で型を書かなくても、引数から **型推論** される
- 明示したいときは **ターボフィッシュ** \`::<型>\` を使う: \`first::<i32>(&nums)\`

### T に「できること」を指定する: トレイト境界

次の関数はコンパイルエラーになる。

\`\`\`rust
fn largest<T>(list: &[T]) -> T {
    let mut max = list[0];
    for &x in list {
        if x > max { max = x; } // error[E0369]: T 同士を > で比べられるとは限らない
    }
    max
}
\`\`\`

\`T\` は「どんな型でもよい」ので、比較できない型（例えば自作の構造体）が来るかもしれない。だから Rust は **T に必要な能力を宣言しないと使わせてくれない**。

\`\`\`rust
fn largest<T: PartialOrd + Copy>(list: &[T]) -> T {
    let mut max = list[0];      // Copy なので list から値をコピーして取り出せる
    for &x in list {
        if x > max {            // PartialOrd なので > で比べられる
            max = x;
        }
    }
    max
}
\`\`\`

- \`T: PartialOrd\` … 「T は大小比較できる型に限る」
- \`+ Copy\` … 「さらにコピーできる型に限る」（\`list[0]\` を move せずに取り出すため）
- このように **型パラメータに条件を付ける** ことを **トレイト境界（trait bound）** という

## 構造体のジェネリクス

\`\`\`rust
#[derive(Debug)]
struct Point<T> {
    x: T,
    y: T,
}

fn main() {
    let a = Point { x: 1, y: 2 };       // Point<i32>
    let b = Point { x: 1.5, y: 0.5 };   // Point<f64>
    // let c = Point { x: 1, y: 2.0 };  // エラー: x と y は同じ T でなければならない
}
\`\`\`

x と y に別々の型を許したいなら型パラメータを 2 つにする。

\`\`\`rust
struct Point2<T, U> {
    x: T,
    y: U,
}
let p = Point2 { x: 5, y: "five" }; // Point2<i32, &str>
\`\`\`

標準ライブラリの \`Vec<T>\`、\`HashMap<K, V>\`、\`Box<T>\` もすべてジェネリックな構造体。

## enum のジェネリクス

すでに使っている \`Option\` と \`Result\` はジェネリックな enum。

\`\`\`rust
enum Option<T> {
    Some(T),
    None,
}

enum Result<T, E> {
    Ok(T),
    Err(E),
}
\`\`\`

\`Option<i32>\` も \`Option<String>\` も、この 1 つの定義から作られている。自作もできる。

\`\`\`rust
enum Either<L, R> {
    Left(L),
    Right(R),
}
let a: Either<i32, String> = Either::Left(3);
\`\`\`

## impl のジェネリクス

ジェネリックな型にメソッドを付けるときは **\`impl<T>\`** と書いて「この impl の中で T を使う」と宣言する。

\`\`\`rust
impl<T> Point<T> {
    fn x(&self) -> &T {
        &self.x
    }
}
\`\`\`

- \`impl<T>\` の \`<T>\` … 型パラメータの **宣言**
- \`Point<T>\` の \`<T>\` … その T を **使って** 型を指定している
- 両方必要。\`impl Point<T>\` だけだと「T という名前の具体的な型」を探しに行ってエラーになる

impl にもトレイト境界を付けられる。こうすると「比較できる T のときだけ使えるメソッド」になる。

\`\`\`rust
impl<T: PartialOrd + Copy> Point<T> {
    fn larger(&self) -> T {
        if self.x > self.y { self.x } else { self.y }
    }
}
\`\`\`

メソッド自身が別の型パラメータを持つこともできる。

\`\`\`rust
impl<T> Point<T> {
    fn with_y<U>(self, y: U) -> Point2<T, U> {
        Point2 { x: self.x, y }
    }
}
\`\`\`

## 特定の型だけの impl

\`impl<T>\` ではなく **具体的な型を指定した impl** を書くと、その型のときだけ使えるメソッドを生やせる。

\`\`\`rust
impl Point<f64> {
    fn distance_from_origin(&self) -> f64 {
        (self.x * self.x + self.y * self.y).sqrt() // sqrt は f64 のメソッド
    }
}

fn main() {
    let p = Point { x: 3.0, y: 4.0 };
    println!("{}", p.distance_from_origin()); // 5
    let q = Point { x: 3, y: 4 };
    // q.distance_from_origin(); // エラー: Point<i32> にはこのメソッドはない
}
\`\`\`

## 単相化（monomorphization）でゼロコスト

「ジェネリクスを使うと遅くなる？」→ **ならない**。Rust のコンパイラは、ジェネリックな関数が **実際に使われた型ごとに専用のコードを生成** する。これを **単相化** という。

\`\`\`rust
let a = Some(5);    // Option<i32>
let b = Some(1.0);  // Option<f64>
\`\`\`

コンパイラは内部的にこう展開するイメージ。

\`\`\`rust
enum Option_i32 { Some(i32), None }
enum Option_f64 { Some(f64), None }
\`\`\`

- 実行時に「この T は何型？」と調べる処理が一切ない → **手で型ごとに書いたのと同じ速さ**（ゼロコスト抽象化）
- 代わりに、使う型が増えるほどバイナリが少し大きくなり、コンパイルも少し遅くなる
- Java のジェネリクス（型消去）や JS の動的型とはここが根本的に違う

## const ジェネリクス（配列の長さをパラメータにする）

配列 \`[T; N]\` の **長さ N** も型の一部。長さが違う配列は別の型になる（\`[i32; 3]\` と \`[i32; 4]\` は別物）。
**const ジェネリクス** を使うと、長さ N をパラメータにして「どんな長さの配列でも受け取る関数」が書ける。

\`\`\`rust
fn sum<const N: usize>(arr: [i32; N]) -> i32 {
    let mut total = 0;
    for x in arr {
        total += x;
    }
    total
}

fn main() {
    println!("{}", sum([1, 2, 3]));       // N = 3
    println!("{}", sum([10, 20, 30, 40])); // N = 4
}
\`\`\`

- \`const N: usize\` … 「N は型ではなく **usize の定数** のパラメータ」
- 型パラメータと一緒に使える: \`fn show<T: std::fmt::Debug, const N: usize>(arr: [T; N])\`
- 構造体にも使える: \`struct Matrix<const R: usize, const C: usize> { data: [[f64; C]; R] }\`
- スライス \`&[T]\` でも「任意の長さ」を受け取れるが、const ジェネリクスなら長さがコンパイル時に決まっているので、長さを型で保証できる

## まとめ

| 書き方 | 意味 |
|---|---|
| \`fn f<T>(x: T)\` | ジェネリック関数 |
| \`fn f<T: Trait>(x: T)\` | トレイト境界つき |
| \`struct S<T> { v: T }\` | ジェネリック構造体 |
| \`enum E<T> { A(T), B }\` | ジェネリック enum |
| \`impl<T> S<T> { }\` | すべての T に対するメソッド |
| \`impl<T: Trait> S<T> { }\` | 条件を満たす T だけのメソッド |
| \`impl S<f64> { }\` | 特定の型だけのメソッド |
| \`fn f<const N: usize>(a: [i32; N])\` | const ジェネリクス |
| \`f::<i32>(x)\` | ターボフィッシュで型を明示 |`,
    hints: [
      "`<T>` で型パラメータを宣言する。関数・構造体・enum・impl に使える。",
      "T に演算やメソッドを使うには `T: PartialOrd` のようなトレイト境界が必要。",
      "単相化により型ごとに専用コードが作られるので実行時コストはゼロ。",
      "`const N: usize` で配列の長さもパラメータにできる。",
    ],
  },
  learn: {
    quiz: [
      {
        prompt: "次のコードがコンパイルエラーになる理由は？",
        snippet: `fn bigger<T>(a: T, b: T) -> T {
    if a > b { a } else { b }
}
`,
        choices: [
          "T が比較できる型だと宣言していない（トレイト境界がない）",
          "ジェネリック関数は値を返せない",
          "引数を 2 つ取れない",
          "if は式として使えない",
        ],
        answer: "T が比較できる型だと宣言していない（トレイト境界がない）",
        explain: "`T: PartialOrd` を付けて「比較できる型に限る」と宣言しないと `>` は使えない。",
      },
      {
        prompt: "`impl<T> Point<T>` の最初の `<T>` の役割は？",
        choices: [
          "この impl で使う型パラメータ T を宣言している",
          "T を i32 に固定している",
          "Point を 2 回定義している",
          "省略可能な飾り",
        ],
        answer: "この impl で使う型パラメータ T を宣言している",
        explain:
          "`impl<T>` で宣言し、`Point<T>` でその T を使う。宣言がないと T という具体型を探してエラーになる。",
      },
      {
        prompt: "`impl Point<f64> { fn dist(&self) -> f64 { ... } }` と書いたとき、正しいのは？",
        choices: [
          "Point<f64> の値でだけ dist が呼べる",
          "どの Point<T> でも dist が呼べる",
          "Point<i32> は作れなくなる",
          "コンパイルエラーになる",
        ],
        answer: "Point<f64> の値でだけ dist が呼べる",
        explain:
          "具体的な型を指定した impl は、その型のときだけ使えるメソッドを追加する。Point<i32> 自体は普通に作れる。",
      },
      {
        prompt: "Rust のジェネリクスの実行時コストについて正しいのは？",
        choices: [
          "単相化で型ごとに専用コードが作られるので、実行時のコストはない",
          "実行時に型を調べるので少し遅い",
          "すべて Box に包まれるので遅い",
          "ジェネリクスはデバッグビルドでしか使えない",
        ],
        answer: "単相化で型ごとに専用コードが作られるので、実行時のコストはない",
        explain:
          "コンパイル時に使われた型ごとにコードを生成する（単相化）。代わりにバイナリサイズとコンパイル時間が少し増える。",
      },
      {
        prompt: "`let p = Point { x: 1, y: 2.0 };` がエラーになる定義は？",
        choices: [
          "struct Point<T> { x: T, y: T }",
          "struct Point<T, U> { x: T, y: U }",
          "struct Point { x: i32, y: f64 }",
          "struct Point<T> { x: i32, y: T }",
        ],
        answer: "struct Point<T> { x: T, y: T }",
        explain: "x と y が同じ T なので、i32 と f64 を混ぜられない。",
      },
      {
        prompt: "次の関数を `sum([1, 2, 3, 4])` で呼んだとき、N は？",
        snippet: `fn sum<const N: usize>(arr: [i32; N]) -> i32 {
    arr.iter().sum()
}
`,
        choices: ["4", "3", "i32", "決まらない（コンパイルエラー）"],
        answer: "4",
        explain: "const ジェネリクスの N は配列の長さから推論される。[i32; 4] なので N = 4。",
      },
      {
        prompt: "ジェネリック関数の型を明示的に指定する書き方（ターボフィッシュ）は？",
        choices: ["parse::<i32>()", "parse<i32>()", "parse(i32)()", "parse as i32()"],
        answer: "parse::<i32>()",
        explain:
          "式の中では `<` が比較演算子と紛らわしいので `::<型>` と書く。魚の形に見えるのでターボフィッシュと呼ばれる。",
      },
    ],
  },
});
