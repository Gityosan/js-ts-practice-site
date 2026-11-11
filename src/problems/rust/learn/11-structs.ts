import { defineProblem } from "../../../core/schemas";

export default defineProblem({
  id: "rust-learn-structs",
  stage: "learn",
  language: "rust",
  scenario: "rust",
  copy: {
    title: "構造体（struct）とメソッド",
    prompt: `## 構造体とは

**構造体（struct）** は、関係のある複数の値をひとまとめにして名前を付けた **自分で作る型**。
JS のオブジェクト \`{ name: "Alice", age: 30 }\` に近いが、Rust では **先に型（形）を定義してから** 値を作る。
フィールドの名前と型はコンパイル時に決まっていて、あとから勝手にフィールドを増やすことはできない。

\`\`\`rust
struct User {
    name: String,
    email: String,
    age: u32,
    active: bool,
}
\`\`\`

- 型名は **UpperCamelCase**（\`User\`, \`HttpRequest\`）、フィールド名は **snake_case** が慣習
- 最後のフィールドの後ろの \`,\` はあってもなくてもよい（付けるのが慣習）
- 定義は \`fn\` の外（トップレベル）に書くのが普通

## インスタンスを作る・フィールドを読む

\`\`\`rust
let user = User {
    name: String::from("Alice"),
    email: String::from("alice@example.com"),
    age: 30,
    active: true,
};
println!("{} は {} 歳", user.name, user.age); // ドット記法で読む
\`\`\`

- **全フィールドを指定しないとコンパイルエラー**（E0063）。JS のように「書き忘れたら undefined」にはならない
- フィールドを書く順番は定義と違ってもよい

### 書き換えるには変数ごと mut

\`\`\`rust
let mut user = User { /* ... */ };
user.age = 31;      // OK
user.active = false;
\`\`\`

Rust では **一部のフィールドだけを mut にすることはできない**。可変性は「変数（束縛）」に付く性質なので、インスタンス全体が mut か、全体が不変かのどちらか。

## フィールド初期化省略記法

変数名とフィールド名が同じなら \`name: name\` を \`name\` と省略できる（JS の \`{ name }\` と同じ発想）。

\`\`\`rust
fn build_user(name: String, email: String) -> User {
    User {
        name,          // name: name の省略
        email,         // email: email の省略
        age: 0,
        active: true,
    }
}
\`\`\`

## 構造体更新構文 ..

「ほとんど同じで一部だけ違う」インスタンスを作るときは \`..元の値\` で残りのフィールドをコピー（ムーブ）できる。JS のスプレッド \`{ ...user1, email: "x" }\` に近い。

\`\`\`rust
let user2 = User {
    email: String::from("bob@example.com"),
    ..user1          // 残り（name, age, active）は user1 から
};
\`\`\`

- \`..user1\` は **必ず最後** に書く
- **注意: これはムーブ**。上の例では \`name\`（String）が user2 に移動するので、以後 \`user1.name\` は使えない（\`user1.age\` など Copy 型のフィールドはまだ使える）
- \`name\` と \`email\` の両方を新しく指定していれば、移動するのは Copy 型だけなので user1 は丸ごと使い続けられる

## タプル構造体

フィールドに名前を付けず、型だけを並べた構造体。**同じ形でも意味が違う型を区別したい** ときに便利。

\`\`\`rust
struct Color(u8, u8, u8);
struct Point3(i32, i32, i32);

let black = Color(0, 0, 0);
let origin = Point3(0, 0, 0);
println!("{}", black.0);      // 番号でアクセス
let Color(r, g, b) = black;   // 分解もできる
\`\`\`

\`Color\` と \`Point3\` は中身がどちらも 3 つの数だが **別の型** なので、取り違えるとコンパイルエラーになる。
1 要素だけのタプル構造体（\`struct Meters(f64);\`）は **ニュータイプ** と呼ばれ、単位の取り違え防止によく使う。

## ユニット構造体

フィールドを 1 つも持たない構造体。値としてのデータは要らないが「型」が欲しいとき（トレイトを実装するための目印など）に使う。

\`\`\`rust
struct AlwaysEqual;
let subject = AlwaysEqual;
\`\`\`

## impl ブロックとメソッド

構造体に関数をぶら下げるには \`impl 型名 { ... }\` を書く。中に書いた関数のうち、**第 1 引数が self 系** のものを **メソッド** と呼び、\`値.メソッド()\` で呼べる。

\`\`\`rust
struct Rectangle {
    width: u32,
    height: u32,
}

impl Rectangle {
    fn area(&self) -> u32 {              // 読むだけ → &self
        self.width * self.height
    }
    fn scale(&mut self, k: u32) {        // 書き換える → &mut self
        self.width *= k;
        self.height *= k;
    }
    fn into_square(self) -> Rectangle {  // 自分を消費する → self
        let side = self.width.max(self.height);
        Rectangle { width: side, height: side }
    }
}

let mut r = Rectangle { width: 3, height: 4 };
println!("{}", r.area());   // 12
r.scale(2);                 // r は mut が必要
let sq = r.into_square();   // ここで r はムーブされ、以後使えない
\`\`\`

### self の 3 つの受け取り方

| 書き方 | 意味 | 呼んだ後の元の値 | 使いどころ |
|---|---|---|---|
| \`&self\` | 不変で借用（\`self: &Self\` の略） | そのまま使える | 計算・読み取り（一番多い） |
| \`&mut self\` | 可変で借用 | 使える（中身は変わる） | 状態の更新（カウンタを増やす等） |
| \`self\` | 所有権ごと受け取る | **使えなくなる** | 別の値に変換する・使い切る |

- \`Self\` は「この impl の型」の別名（ここでは \`Rectangle\`）
- \`r.area()\` と書くと、Rust が自動で \`(&r).area()\` のように参照を取ってくれる（**自動参照**）。C++ の \`->\` のような書き分けは不要
- 同じ型に \`impl\` ブロックを複数書いてもよい

## 関連関数と new

\`self\` を取らない関数は **関連関数**。\`型名::関数名()\` で呼ぶ。コンストラクタ役の \`new\` が代表例（Rust に \`new\` キーワードはなく、ただの慣習の名前）。

\`\`\`rust
impl Rectangle {
    fn new(width: u32, height: u32) -> Self {
        Self { width, height }
    }
    fn square(size: u32) -> Self {
        Self { width: size, height: size }
    }
}

let r = Rectangle::new(3, 4);
let s = Rectangle::square(5);
\`\`\`

\`String::from\` や \`Vec::new\` も同じ仕組みの関連関数。

## #[derive(Debug)] と {:?} / {:#?}

構造体はそのままでは \`println!("{}", r)\` も \`{:?}\` もできない（どう表示すべきか Rust には分からないため）。
**\`#[derive(Debug)]\`** を付けると、デバッグ用の表示が自動で実装される。

\`\`\`rust
#[derive(Debug)]
struct Point {
    x: i32,
    y: i32,
}

let p = Point { x: 1, y: 2 };
println!("{:?}", p);   // Point { x: 1, y: 2 }
println!("{:#?}", p);  // 複数行に整形して表示
dbg!(&p);              // ファイル名・行番号付きで標準エラーに出す
\`\`\`

\`{:#?}\` の出力:

\`\`\`text
Point {
    x: 1,
    y: 2,
}
\`\`\`

- \`{}\` で表示したい場合は \`Display\` トレイトを自分で実装する（第 18 章などで扱う）
- \`derive\` は他にも \`Clone\`, \`Copy\`, \`PartialEq\`（\`==\` で比較）, \`Default\` などを自動実装できる
- このサイトの採点は結果を \`{:?}\` で表示して比べるので、構造体を返す問題では \`#[derive(Debug)]\` が必要になる`,
    hints: [
      "構造体は全フィールドを指定して作る。可変にするなら変数ごと `let mut`。",
      "`..other` の更新構文はムーブを伴う。String などのフィールドが移ると元は使えない。",
      "メソッドの第 1 引数は `&self`（読む）/ `&mut self`（変える）/ `self`（消費）。self なしは関連関数で `型::f()` と呼ぶ。",
      "`#[derive(Debug)]` で `{:?}` / `{:#?}` 表示ができる。",
    ],
  },
  learn: {
    quiz: [
      {
        prompt: "次のコードはなぜコンパイルエラーになる？",
        snippet: `struct P { x: i32, y: i32 }
let p = P { x: 1 };`,
        choices: [
          "フィールド y を指定していないから",
          "x が mut でないから",
          "P に new がないから",
          "セミコロンが足りないから",
        ],
        answer: "フィールド y を指定していないから",
        explain:
          "構造体を作るときは全フィールドの指定が必要（E0063）。省略した値が自動で入ることはない。",
      },
      {
        prompt: "一部のフィールドだけを mut にできる？",
        choices: [
          "できない。mut は変数（インスタンス全体）に付ける",
          "できる。フィールド定義に mut を付ける",
          "pub を付ければできる",
          "タプル構造体ならできる",
        ],
        answer: "できない。mut は変数（インスタンス全体）に付ける",
        explain: "Rust の可変性は束縛に付く。`let mut u = ...` で全フィールドが変更可能になる。",
      },
      {
        prompt: "`let u2 = User { email: e, ..u1 };` の後、`u1.name`（String）は使える？",
        choices: [
          "使えない。name は u2 にムーブされた",
          "使える。..はコピーだから",
          "使える。u1 は変化しない",
          "コンパイルエラーで u2 が作れない",
        ],
        answer: "使えない。name は u2 にムーブされた",
        explain:
          "更新構文は残りのフィールドをムーブする。String は Copy でないので u1.name は移動済みになる。",
      },
      {
        prompt: "状態を書き換えるメソッド（カウンタを 1 増やす等）の第 1 引数として適切なのは？",
        choices: ["&mut self", "&self", "self", "Self"],
        answer: "&mut self",
        explain: "中身を変えるが所有権は奪わない → 可変借用 `&mut self`。",
      },
      {
        prompt:
          "`fn into_parts(self) -> (u32, u32)` を `r.into_parts()` で呼んだ後、r はどうなる？",
        choices: [
          "ムーブされて使えなくなる",
          "そのまま使える",
          "中身が 0 にリセットされる",
          "自動で clone される",
        ],
        answer: "ムーブされて使えなくなる",
        explain: "`self` を値で受け取るメソッドは所有権を奪う（Copy 型でない限り）。",
      },
      {
        prompt: "`Rectangle::new(3, 4)` のように `型名::` で呼ぶ、self を取らない関数を何と呼ぶ？",
        choices: ["関連関数", "メソッド", "クロージャ", "マクロ"],
        answer: "関連関数",
        explain:
          "self を取らない impl 内の関数は関連関数。new は慣習的な名前で、特別なキーワードではない。",
      },
      {
        prompt: '`println!("{:?}", p)` で構造体を表示するのに必要なのは？',
        choices: [
          "#[derive(Debug)] を付ける",
          "#[derive(Display)] を付ける",
          "impl に to_string を書く",
          "何もいらない",
        ],
        answer: "#[derive(Debug)] を付ける",
        explain:
          "`{:?}` は Debug トレイト。derive で自動実装できる。`{}`（Display）は derive できず手で実装する。",
      },
      {
        prompt: "`struct Meters(f64);` と `struct Seconds(f64);` について正しいのは？",
        choices: [
          "中身が同じ f64 でも別の型なので取り違えるとエラー",
          "同じ型として扱われる",
          "タプル構造体は 2 要素以上必要",
          "フィールドには .x でアクセスする",
        ],
        answer: "中身が同じ f64 でも別の型なので取り違えるとエラー",
        explain:
          "タプル構造体（ニュータイプ）は単位などの取り違えを型で防ぐのに使える。中身は `.0` でアクセス。",
      },
    ],
  },
});
