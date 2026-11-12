import { defineProblem } from "../../../core/schemas";

export default defineProblem({
  id: "rust-learn-advanced-traits",
  stage: "learn",
  language: "rust",
  scenario: "rust",
  copy: {
    title: "高度なトレイト",
    prompt: `## この章で扱うこと

- 関連型（associated type）とジェネリクスの違い
- デフォルトのジェネリック型引数
- スーパートレイト（トレイトが別のトレイトを要求する）
- ニュータイプパターン（孤児ルールの回避）
- 完全修飾構文 \`<T as Trait>::f\` と同名メソッドの曖昧さ解消

## 関連型（associated type）

トレイトの中で \`type 名前;\` と宣言する「型のプレースホルダ」。実装する側が具体的な型を決める。代表例は \`Iterator\`。

\`\`\`rust
pub trait Iterator {
    type Item;                              // 関連型
    fn next(&mut self) -> Option<Self::Item>;
}
\`\`\`

\`\`\`rust
struct Counter {
    count: u32,
}

impl Iterator for Counter {
    type Item = u32;  // この実装では Item は u32

    fn next(&mut self) -> Option<u32> {
        if self.count < 5 {
            self.count += 1;
            Some(self.count)
        } else {
            None
        }
    }
}
\`\`\`

### ジェネリクスで書いたら何が違う？

\`\`\`rust
pub trait IteratorG<T> {
    fn next(&mut self) -> Option<T>;
}
\`\`\`

ジェネリクス版だと、**1 つの型に対して \`IteratorG<u32>\` も \`IteratorG<String>\` も実装できてしまう**。すると \`counter.next()\` を呼ぶたびに「どの T の実装か」を型注釈で指定しなければならない。

| | 関連型 \`type Item\` | ジェネリクス \`Trait<T>\` |
|---|---|---|
| 1 つの型に実装できる数 | 1 つだけ | T ごとに何個でも |
| 使う側の型注釈 | 不要（一意に決まる） | 必要になることがある |
| 向いているもの | 「その型にとって自然に 1 つに決まる型」（要素の型など） | 「いろいろな型と組み合わせたい」（\`From<T>\`, \`Add<Rhs>\` など） |

関連型を境界で指定するときは \`Iterator<Item = u32>\` と書く。

\`\`\`rust
fn sum_items<I: Iterator<Item = u32>>(it: I) -> u32 {
    it.sum()
}

fn first<C: Container>(c: &C) -> Option<&C::Item> { // C::Item で関連型を参照
    c.get(0)
}
\`\`\`

## デフォルトのジェネリック型引数

ジェネリック型引数には **デフォルト** を付けられる: \`<T = 既定の型>\`。演算子の \`Add\` がまさにこれ。

\`\`\`rust
trait Add<Rhs = Self> {
    type Output;
    fn add(self, rhs: Rhs) -> Self::Output;
}
\`\`\`

- \`impl Add for Point\` と書けば \`Rhs = Point\`（Self）
- 違う型を足したいときだけ \`impl Add<Meters> for Millimeters\` と明示する

\`\`\`rust
use std::ops::Add;

#[derive(Debug, PartialEq)]
struct Millimeters(u32);
struct Meters(u32);

impl Add<Meters> for Millimeters {
    type Output = Millimeters;
    fn add(self, other: Meters) -> Millimeters {
        Millimeters(self.0 + other.0 * 1000)
    }
}

assert_eq!(Millimeters(500) + Meters(2), Millimeters(2500));
\`\`\`

デフォルト型引数の使いどころ:

- ほとんどの利用者が同じ型を使う場合に、毎回書く手間を省く
- 既存のトレイトに型引数を **後から追加** しても、既存のコードを壊さない

自分のトレイトや構造体でも使える（\`struct Wrapper<T = i32>\` など）。

## スーパートレイト

「このトレイトを実装するなら、あのトレイトも実装していること」を要求できる。\`trait A: B\` と書き、B を A の **スーパートレイト** と呼ぶ。

\`\`\`rust
use std::fmt;

trait OutlinePrint: fmt::Display {      // Display を実装した型だけが実装できる
    fn outline_print(&self) -> String {
        let s = self.to_string();       // Display があるので to_string が使える
        let line = "*".repeat(s.len() + 4);
        format!("{line}\\n* {s} *\\n{line}")
    }
}

struct Point { x: i32, y: i32 }

impl fmt::Display for Point {
    fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
        write!(f, "({}, {})", self.x, self.y)
    }
}

impl OutlinePrint for Point {} // デフォルト実装をそのまま使う
\`\`\`

- \`Display\` を実装していない型に \`impl OutlinePrint\` するとエラー（E0277）
- トレイトのデフォルトメソッドの中で、スーパートレイトのメソッドを使える
- 継承に似ているが、**データやメソッドの実装を引き継ぐのではなく「要求する」だけ**
- 複数要求するなら \`trait A: B + C\`。\`trait Shape: Debug + Clone\` のように使う
- トレイトオブジェクトで「2 つのトレイト両方」が欲しいとき（\`dyn A + B\` は書けない）の解決策にもなる

## ニュータイプパターン

### 孤児ルール（orphan rule）

**トレイトか型のどちらかが自分のクレートのものでないと、\`impl トレイト for 型\` は書けない。**

\`\`\`rust
impl std::fmt::Display for Vec<String> { ... } // エラー[E0117]: Display も Vec も外部のもの
\`\`\`

このルールがあるおかげで、別々のクレートが同じ型に同じトレイトを実装して衝突することがない。

### 回避策: 薄いラッパーで包む

\`\`\`rust
use std::fmt;

struct Wrapper(Vec<String>); // 自分のクレートの新しい型

impl fmt::Display for Wrapper {
    fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
        write!(f, "[{}]", self.0.join(", "))
    }
}

let w = Wrapper(vec![String::from("a"), String::from("b")]);
println!("{w}"); // [a, b]
\`\`\`

1 要素のタプル構造体で包むことを **ニュータイプ（newtype）パターン** と呼ぶ。実行時のコストはゼロ（コンパイル後は中身と同じ）。

### ニュータイプの他の利点

- **単位の取り違えを防ぐ**: \`struct Meters(f64)\` と \`struct Feet(f64)\` は別の型なので混ぜられない
- **内部表現を隠す**: \`struct People(HashMap<u32, String>)\` にして、公開したいメソッドだけ提供する
- **値の検証**: \`struct Email(String)\` を \`new\` 経由でしか作れないようにすれば、「Email 型なら必ず検証済み」を型で保証できる

中身のメソッドを全部使いたければ \`Deref\` を実装する手もあるが（30 章）、多くの場合は必要なメソッドだけを手で公開するほうが意図が明確。

## 完全修飾構文と曖昧さの解消

### 同名メソッド

Rust では、**別々のトレイトに同じ名前のメソッド** があっても、1 つの型が両方を実装できる。型自身にも同名のメソッドを定義できる。

\`\`\`rust
trait Pilot { fn fly(&self) -> String; }
trait Wizard { fn fly(&self) -> String; }

struct Human;

impl Pilot for Human {
    fn fly(&self) -> String { String::from("機長です") }
}
impl Wizard for Human {
    fn fly(&self) -> String { String::from("浮遊！") }
}
impl Human {
    fn fly(&self) -> String { String::from("腕をばたばた") }
}

let person = Human;
person.fly();          // 型自身のメソッドが優先: "腕をばたばた"
Pilot::fly(&person);   // "機長です"
Wizard::fly(&person);  // "浮遊！"
Human::fly(&person);   // "腕をばたばた"（person.fly() と同じ）
\`\`\`

\`self\` を受け取るメソッドなら、\`トレイト名::メソッド(&値)\` で「どのトレイトのものか」を指定できる。\`self\` の型から実装が決まるから。

### self を取らない関連関数

関連関数（\`self\` なし）だと、\`トレイト名::関数()\` ではどの型の実装か分からない。

\`\`\`rust
trait Animal {
    fn baby_name() -> String;
}

struct Dog;

impl Dog {
    fn baby_name() -> String { String::from("ポチ") }
}
impl Animal for Dog {
    fn baby_name() -> String { String::from("子犬") }
}

Dog::baby_name();             // "ポチ"（型自身の関連関数）
// Animal::baby_name();       // エラー[E0790]: どの型の実装か分からない
<Dog as Animal>::baby_name(); // "子犬"
\`\`\`

この \`<型 as トレイト>::関数\` が **完全修飾構文（fully qualified syntax）**。一般形は次の通り。

\`\`\`rust
<Type as Trait>::function(receiver_if_method, next_arg, ...);
\`\`\`

普段は省略できる部分を全部書いた形で、曖昧なときだけ使えばよい。関連型も \`<T as Iterator>::Item\` のように書ける。

### 関連定数

トレイトには定数も置ける。

\`\`\`rust
trait Shape {
    const SIDES: u32;
}
struct Triangle;
impl Shape for Triangle {
    const SIDES: u32 = 3;
}
assert_eq!(<Triangle as Shape>::SIDES, 3);
assert_eq!(Triangle::SIDES, 3); // 曖昧でなければ省略可
\`\`\`

## まとめ

| 機能 | 書き方 | 用途 |
|---|---|---|
| 関連型 | \`type Item;\` / \`Iterator<Item = u32>\` | 実装ごとに 1 つに決まる型 |
| デフォルト型引数 | \`trait Add<Rhs = Self>\` | よく使う型を省略可能に |
| スーパートレイト | \`trait A: Display\` | 前提となるトレイトを要求 |
| ニュータイプ | \`struct Wrapper(Vec<String>);\` | 孤児ルール回避・型の区別 |
| 完全修飾構文 | \`<Dog as Animal>::baby_name()\` | 同名の関数・メソッドを区別 |`,
    hints: [
      "関連型は 1 つの型につき実装が 1 つに決まる。ジェネリクスなら型引数ごとに何個でも実装できる。",
      "`trait Add<Rhs = Self>` のようにジェネリック型引数にはデフォルトを付けられる。",
      "`trait A: B` で、A を実装するには B も必要（スーパートレイト）。",
      "外部の型に外部のトレイトは実装できない（孤児ルール）→ ニュータイプで包む。同名関数は `<T as Trait>::f` で区別。",
    ],
  },
  learn: {
    quiz: [
      {
        prompt:
          "`Iterator` が `Item` をジェネリクス `Iterator<T>` ではなく関連型にしている主な理由は？",
        choices: [
          "1 つの型に対して実装が 1 つに決まり、使うたびに型注釈を書かなくて済むから",
          "関連型のほうが実行速度が速いから",
          "関連型でないと Vec に入れられないから",
          "ジェネリクスはトレイトに使えないから",
        ],
        answer: "1 つの型に対して実装が 1 つに決まり、使うたびに型注釈を書かなくて済むから",
        explain:
          "ジェネリクスなら Iterator<u32> と Iterator<String> を同じ型に実装できてしまい、どれを使うか毎回指定が必要になる。",
      },
      {
        prompt: "`impl Add for Point` と書いたとき、右辺の型 `Rhs` は？",
        choices: ["Point（デフォルトの Self）", "i32", "未指定でコンパイルエラー", "()"],
        answer: "Point（デフォルトの Self）",
        explain: "Add<Rhs = Self> とデフォルト型引数が付いている。",
      },
      {
        prompt: "次のコードがエラーになる理由は？",
        snippet: `trait OutlinePrint: std::fmt::Display {}
struct P;
impl OutlinePrint for P {}`,
        choices: [
          "P が Display を実装していないから",
          "OutlinePrint にメソッドがないから",
          "P がフィールドを持たないから",
          "トレイトに : は書けないから",
        ],
        answer: "P が Display を実装していないから",
        explain:
          "Display は OutlinePrint のスーパートレイト。OutlinePrint を実装するには Display も必要。",
      },
      {
        prompt: "`impl std::fmt::Display for Vec<i32>` が書けない理由は？",
        choices: [
          "トレイトも型も外部のもので、孤児ルールに反するから",
          "Vec は Display を持てないから",
          "i32 が Display でないから",
          "Display はマクロだから",
        ],
        answer: "トレイトも型も外部のもので、孤児ルールに反するから",
        explain: "自分のクレートの新しい型（struct Wrapper(Vec<i32>)）で包めば実装できる。",
      },
      {
        prompt:
          "`Dog` 自身と `Animal` トレイトの両方に `fn baby_name() -> String` がある。トレイトの方を呼ぶには？",
        choices: [
          "<Dog as Animal>::baby_name()",
          "Animal::baby_name()",
          "Dog::baby_name()",
          "Dog.Animal::baby_name()",
        ],
        answer: "<Dog as Animal>::baby_name()",
        explain:
          "self がないので Animal::baby_name() ではどの型の実装か分からない。完全修飾構文で型とトレイトを両方指定する。",
      },
      {
        prompt:
          "`person` が `Pilot` と `Wizard` の両方の `fly(&self)` と自身の `fly` を持つ。`person.fly()` で呼ばれるのは？",
        choices: [
          "型自身（impl Human）の fly",
          "Pilot の fly",
          "Wizard の fly",
          "曖昧でコンパイルエラー",
        ],
        answer: "型自身（impl Human）の fly",
        explain:
          "型に直接定義したメソッドが優先される。トレイトの方は Pilot::fly(&person) のように呼ぶ。",
      },
      {
        prompt: "ニュータイプパターンの利点として **当てはまらない** ものは？",
        choices: [
          "実行時に追加のメモリと処理が必要になる",
          "単位の取り違えを型で防げる",
          "内部表現を隠して公開 API を絞れる",
          "孤児ルールを回避できる",
        ],
        answer: "実行時に追加のメモリと処理が必要になる",
        explain: "ニュータイプはゼロコスト抽象化。コンパイル後は中身と同じ表現になる。",
      },
    ],
  },
});
