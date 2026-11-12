import { defineProblem } from "../../../core/schemas";

export default defineProblem({
  id: "rust-learn-traits",
  stage: "learn",
  language: "rust",
  scenario: "rust",
  copy: {
    title: "トレイト（共通の振る舞いを定義する）",
    prompt: `## トレイトとは

**トレイト（trait）** は「この型はこういうメソッドを持っている」という **振る舞いの約束** を定義するもの。
Java / TypeScript の **interface** に近い。異なる型に共通の能力を持たせ、ジェネリクスで「その能力を持つ型なら何でも受け取る」関数を書けるようになる。

\`\`\`rust
trait Summary {
    fn summarize(&self) -> String; // シグネチャだけ（中身なし）。末尾は ;
}
\`\`\`

- \`trait 名前 { ... }\` で定義
- 中には **メソッドのシグネチャ** を並べる。実装する型がこれを必ず実装しなければならない

## トレイトを実装する: impl トレイト for 型

\`\`\`rust
struct Article {
    title: String,
    author: String,
}

struct Tweet {
    user: String,
    text: String,
}

impl Summary for Article {
    fn summarize(&self) -> String {
        format!("{} by {}", self.title, self.author)
    }
}

impl Summary for Tweet {
    fn summarize(&self) -> String {
        format!("@{}: {}", self.user, self.text)
    }
}

fn main() {
    let t = Tweet { user: "rust".into(), text: "1.0 released".into() };
    println!("{}", t.summarize()); // @rust: 1.0 released
}
\`\`\`

- **\`impl トレイト名 for 型名 { ... }\`** の形
- トレイトのメソッドを **全部** 実装しないと \`error[E0046]\`
- シグネチャ（引数・戻り値の型）が違うと \`error[E0053]\`
- 別モジュールで定義されたトレイトのメソッドを呼ぶには、そのトレイトを \`use\` でスコープに入れる必要がある（\`use std::fmt::Write;\` など）

TypeScript の interface は「形が合っていれば OK（構造的型付け）」だが、Rust は **\`impl ... for\` と明示的に書いたものだけ** がそのトレイトを実装したことになる（名目的型付け）。

## デフォルト実装

トレイトのメソッドに中身を書いておくと、それが **デフォルト実装** になる。実装する側は書かなければデフォルトを使い、書けば上書き（オーバーライド）できる。

\`\`\`rust
trait Greet {
    fn name(&self) -> String;                 // 必須

    fn greet(&self) -> String {               // デフォルト実装つき
        format!("Hello, {}!", self.name())    // 他のメソッドを呼んでもよい
    }
}

struct Person { name: String }
struct Robot { id: u32 }

impl Greet for Person {
    fn name(&self) -> String { self.name.clone() }
    // greet は書かない → デフォルトを使う
}

impl Greet for Robot {
    fn name(&self) -> String { format!("R-{}", self.id) }
    fn greet(&self) -> String {               // 上書き
        format!("BEEP. I AM {}.", self.name())
    }
}
\`\`\`

デフォルト実装から、まだ実装されていない必須メソッド（ここでは \`name\`）を呼べるのがポイント。「少しだけ実装すれば色々なメソッドがタダで手に入る」設計ができる（\`Iterator\` は \`next\` だけ実装すれば \`map\` や \`filter\` が全部使える）。

## トレイト境界: T: Trait

ジェネリクスと組み合わせると、「そのトレイトを実装した型なら何でも」受け取れる関数になる。

\`\`\`rust
fn notify<T: Summary>(item: &T) -> String {
    format!("速報! {}", item.summarize())
}

notify(&tweet);   // OK
notify(&article); // OK
// notify(&42);   // error[E0277]: i32 は Summary を実装していない
\`\`\`

\`T: Summary\` が **トレイト境界**。「T は Summary を実装している型に限る」という条件で、だから関数の中で \`item.summarize()\` が呼べる。

### 複数の境界: +

\`\`\`rust
use std::fmt::Display;

fn show_and_compare<T: Display + PartialOrd>(a: T, b: T) -> String {
    if a > b { format!("{} が大きい", a) } else { format!("{} が大きい", b) }
}
\`\`\`

### where 句

境界が増えて読みにくいときは、**\`where\`** で後ろにまとめて書ける。意味はまったく同じ。

\`\`\`rust
use std::fmt::{Debug, Display};

// 読みにくい
fn f<T: Display + Clone, U: Clone + Debug>(t: &T, u: &U) -> String { todo!() }

// where 句
fn g<T, U>(t: &T, u: &U) -> String
where
    T: Display + Clone,
    U: Clone + Debug,
{
    format!("{} {:?}", t, u)
}
\`\`\`

## impl Trait

### 引数の impl Trait

\`&impl Summary\` は「Summary を実装した何かへの参照」。トレイト境界の **短縮記法**。

\`\`\`rust
fn notify(item: &impl Summary) -> String {
    format!("速報! {}", item.summarize())
}
// fn notify<T: Summary>(item: &T) -> String とほぼ同じ
\`\`\`

違いは、2 つの引数を **同じ型に揃えたい** ときはジェネリクスの書き方が必要なこと。

\`\`\`rust
fn pair1(a: &impl Summary, b: &impl Summary) {} // a と b は別の型でもよい
fn pair2<T: Summary>(a: &T, b: &T) {}           // a と b は同じ型でなければならない
\`\`\`

### 戻り値の impl Trait

戻り値の型を「Summary を実装した何か」とだけ書ける。具体的な型を呼び出し側に隠せる。

\`\`\`rust
fn make_tweet() -> impl Summary {
    Tweet { user: "bot".into(), text: "hi".into() }
}
\`\`\`

- イテレータやクロージャのように **型名が長い・書けない** ものを返すときに特に便利（\`-> impl Iterator<Item = i32>\`, \`-> impl Fn(i32) -> i32\`）
- **制限**: 返す具体的な型は **1 種類** でなければならない。\`if\` で Tweet と Article を出し分けることはできない（それには \`Box<dyn Summary>\` を使う。トレイトオブジェクトという仕組みで、実行時に呼ぶメソッドを決める）

| 書き方 | いつ型が決まるか | 特徴 |
|---|---|---|
| \`T: Summary\` / \`impl Summary\` | コンパイル時（単相化） | 速い。1 つの型に決まる |
| \`Box<dyn Summary>\` / \`&dyn Summary\` | 実行時（動的ディスパッチ） | 異なる型を混ぜて Vec に入れられる |

## ブランケット実装（まとめて実装）

「**ある条件を満たすすべての型** にトレイトを実装する」こともできる。これを **ブランケット実装** という。

\`\`\`rust
use std::fmt::Debug;

trait Describe {
    fn describe(&self) -> String;
}

impl<T: Debug> Describe for T {
    fn describe(&self) -> String {
        format!("<{:?}>", self)
    }
}

fn main() {
    println!("{}", 42.describe());          // <42>
    println!("{}", vec![1, 2].describe());  // <[1, 2]>
    println!("{}", "hi".describe());        // <"hi">
}
\`\`\`

標準ライブラリでも多用されている。例えば \`impl<T: Display> ToString for T\` があるおかげで、**Display を実装した型は自動的に \`.to_string()\` が使える**。

## 孤児ルール（orphan rule）

トレイトを実装するには、**トレイトか型の少なくとも一方が自分のクレート（自分のコード）で定義されている** 必要がある。

| トレイト | 型 | 実装できる？ |
|---|---|---|
| 自作 \`Summary\` | 自作 \`Tweet\` | できる |
| 自作 \`Summary\` | 外部 \`Vec<T>\` | できる |
| 外部 \`Display\` | 自作 \`Tweet\` | できる |
| 外部 \`Display\` | 外部 \`Vec<T>\` | **できない**（\`error[E0117]\`） |

なぜ？ もし誰でも \`impl Display for Vec<i32>\` を書けたら、2 つのライブラリが別々の実装を書いたときにどちらを使うか決められなくなる。孤児ルールは **実装の衝突を防ぐ** ためのもの。

外部の型に外部のトレイトを実装したいときは、**ニュータイプパターン**（自作の型で包む）を使う。

\`\`\`rust
use std::fmt;

struct Words(Vec<String>); // 自作の型で包む

impl fmt::Display for Words {
    fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
        write!(f, "{}", self.0.join(" "))
    }
}
\`\`\`

## まとめ

- \`trait\` で振る舞いを定義、\`impl Trait for Type\` で実装
- デフォルト実装は書けば上書き、書かなければそのまま使われる
- \`T: Trait\`、\`T: A + B\`、\`where\` 句、\`impl Trait\` はどれも「その能力を持つ型だけ受け取る」書き方
- 戻り値の \`impl Trait\` は型を隠せるが 1 種類だけ
- \`impl<T: X> Y for T\` でまとめて実装（ブランケット実装）
- 外部トレイト × 外部型は実装できない（孤児ルール）→ ニュータイプで包む`,
    hints: [
      "`impl トレイト for 型` で実装。必須メソッドは全部書く。",
      "デフォルト実装は上書きしてもしなくてもよい。",
      "`T: Trait` / `impl Trait` / `where` 句でトレイト境界を書く。",
      "外部トレイトを外部型に実装するのは孤児ルールで禁止。ニュータイプで包む。",
    ],
  },
  learn: {
    quiz: [
      {
        prompt: "トレイトのメソッドに中身 `{ ... }` を書いておくと、それは何になる？",
        choices: ["デフォルト実装", "必須メソッド", "コンパイルエラー", "static メソッド"],
        answer: "デフォルト実装",
        explain: "実装する型が書かなければそれが使われ、書けば上書きされる。",
      },
      {
        prompt: "次の 2 つの関数の違いは？",
        snippet: `fn a(x: &impl Summary, y: &impl Summary) {}
fn b<T: Summary>(x: &T, y: &T) {}
`,
        choices: [
          "b は x と y が同じ型でなければならない",
          "a は x と y が同じ型でなければならない",
          "まったく同じ",
          "a はコンパイルエラー",
        ],
        answer: "b は x と y が同じ型でなければならない",
        explain:
          "impl Trait はそれぞれ独立した型パラメータになる。同じ型に揃えたいならジェネリクスで 1 つの T を使う。",
      },
      {
        prompt: "`impl std::fmt::Display for Vec<i32> { ... }` がエラーになる理由は？",
        choices: [
          "トレイトも型も外部のクレートで定義されているから（孤児ルール）",
          "Vec は Display を持たないといけないから",
          "Display はトレイトではないから",
          "ジェネリクスが必要だから",
        ],
        answer: "トレイトも型も外部のクレートで定義されているから（孤児ルール）",
        explain:
          "トレイトか型の少なくとも一方が自分のクレートのものでないと実装できない。自作の型で包む（ニュータイプ）と回避できる。",
      },
      {
        prompt: "戻り値を `-> impl Summary` にした関数について正しいのは？",
        choices: [
          "返す具体的な型は 1 種類でなければならない",
          "if で Tweet と Article を出し分けて返せる",
          "必ず Box に包まれる",
          "呼び出し側は具体的な型名を知っている必要がある",
        ],
        answer: "返す具体的な型は 1 種類でなければならない",
        explain:
          "impl Trait は「コンパイラは知っているが名前を隠した 1 つの型」。複数の型を返したいなら Box<dyn Trait> を使う。",
      },
      {
        prompt: "`impl<T: Display> ToString for T` のような実装を何と呼ぶ？",
        choices: ["ブランケット実装", "デフォルト実装", "孤児実装", "単相化"],
        answer: "ブランケット実装",
        explain:
          "条件を満たす型すべてにまとめて実装する。これにより Display を実装した型は自動で to_string() が使える。",
      },
      {
        prompt: "where 句を使う主な理由は？",
        choices: [
          "トレイト境界が多いときに読みやすくするため",
          "実行速度を上げるため",
          "境界の意味を変えるため",
          "ライフタイムを省略するため",
        ],
        answer: "トレイト境界が多いときに読みやすくするため",
        explain:
          "`fn f<T: A + B>` と `fn f<T>() where T: A + B` は同じ意味。長くなるときは where のほうが読みやすい。",
      },
      {
        prompt: "トレイトの必須メソッドを 1 つ実装し忘れたときのエラーは？",
        choices: [
          "E0046（必要なメソッドが実装されていない）",
          "E0382（move 後の使用）",
          "E0106（ライフタイム不足）",
          "エラーにならず実行時に panic",
        ],
        answer: "E0046（必要なメソッドが実装されていない）",
        explain:
          "デフォルト実装のないメソッドは全部実装しなければならない。チェックはコンパイル時に行われる。",
      },
    ],
  },
});
