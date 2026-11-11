import { defineProblem } from "../../../core/schemas";

export default defineProblem({
  id: "rust-learn-enums-option",
  stage: "learn",
  language: "rust",
  scenario: "rust",
  copy: {
    title: "列挙型（enum）と Option",
    prompt: `## 列挙型（enum）とは

**enum** は「**このうちのどれか 1 つ**」を表す型。取りうる候補（**バリアント / variant**）を列挙して定義する。

\`\`\`rust
enum Direction {
    North,
    East,
    South,
    West,
}

let d = Direction::North;   // 型名::バリアント名 で値を作る
\`\`\`

- 構造体が「A **かつ** B かつ C」（全部持つ）なのに対し、enum は「A **または** B または C」（どれか 1 つ）
- TypeScript の \`type Direction = "north" | "east" | ...\`（ユニオン型）に近い。JS には直接対応する機能がない
- バリアント名も UpperCamelCase

## データを持つバリアント

Rust の enum の強みは、**バリアントごとに違う形のデータを持てる** こと。

\`\`\`rust
enum Message {
    Quit,                         // データなし
    Move { x: i32, y: i32 },      // 名前付きフィールド（構造体風）
    Write(String),                // 1 つの値（タプル風）
    ChangeColor(u8, u8, u8),      // 複数の値
}

let m1 = Message::Quit;
let m2 = Message::Move { x: 10, y: -3 };
let m3 = Message::Write(String::from("hi"));
let m4 = Message::ChangeColor(255, 0, 0);
\`\`\`

これを構造体で表そうとすると「種類を表すフィールド + 使わないかもしれないフィールドたち」になり、ありえない組み合わせ（Quit なのに x がある等）を作れてしまう。enum なら **ありえない状態を型で表現できなくする** ことができる。

中のデータを取り出すには \`match\` を使う（詳しくは次の章）。

\`\`\`rust
fn describe(m: &Message) -> String {
    match m {
        Message::Quit => String::from("終了"),
        Message::Move { x, y } => format!("({x}, {y}) へ移動"),
        Message::Write(text) => format!("書く: {text}"),
        Message::ChangeColor(r, g, b) => format!("色 {r},{g},{b}"),
    }
}
\`\`\`

## enum に impl でメソッドを付ける

構造体と同じく \`impl\` でメソッドや関連関数を定義できる。

\`\`\`rust
#[derive(Debug, Clone, Copy, PartialEq)]
enum Light {
    Red,
    Yellow,
    Green,
}

impl Light {
    fn next(self) -> Light {
        match self {
            Light::Red => Light::Green,
            Light::Green => Light::Yellow,
            Light::Yellow => Light::Red,
        }
    }
    fn seconds(&self) -> u32 {
        match self {
            Light::Red => 30,
            Light::Yellow => 3,
            Light::Green => 25,
        }
    }
}

let l = Light::Red.next();   // Green
\`\`\`

- \`#[derive(Debug)]\` で \`{:?}\` 表示（\`Red\`, \`Move { x: 10, y: -3 }\`, \`Write("hi")\` のように出る）
- \`#[derive(PartialEq)]\` で \`==\` 比較ができる
- \`#[derive(Clone, Copy)]\` を付けると、データなしの小さな enum を整数のように気軽にコピーできる
- \`use Light::*;\` と書けば \`Light::\` を省略して \`Red\` と書ける

### 整数値を持たせる（C 風 enum）

\`\`\`rust
enum Status {
    Ok = 200,
    NotFound = 404,
}
let code = Status::NotFound as i32;   // 404
\`\`\`

## null がない世界と Option<T>

多くの言語には \`null\` / \`undefined\` があり、「値がないかもしれない」変数をうっかり使って **実行時に落ちる**（\`Cannot read properties of null\`、NullPointerException）。null を発明した本人が「10 億ドルの誤り」と呼んだほど。

Rust には **null がない**。代わりに「あるかもしれないし、ないかもしれない」を標準ライブラリの enum **\`Option<T>\`** で表す。

\`\`\`rust
enum Option<T> {
    None,      // 値がない
    Some(T),   // T 型の値がある
}
\`\`\`

- \`T\` は型引数（ジェネリクス）。\`Option<i32>\`, \`Option<String>\`, \`Option<&str>\` など何でも入る
- よく使うので \`Option::\` を付けずに \`Some(5)\` / \`None\` と書ける（prelude に入っている）

\`\`\`rust
let a: Option<i32> = Some(5);
let b: Option<i32> = None;          // None だけだと型が分からないので注釈が要る
let c = Some("hello");              // Option<&str> と推論
\`\`\`

### なぜ安全なのか

**\`Option<i32>\` と \`i32\` は別の型** なので、そのままでは足し算すらできない。

\`\`\`rust
let x: i32 = 5;
let y: Option<i32> = Some(5);
// let sum = x + y;   // コンパイルエラー: i32 と Option<i32> は足せない
\`\`\`

「値がないかもしれない」ことが型に書かれているので、**使う前に必ず「None だったらどうするか」を書かされる**。普通の \`i32\` は絶対に値があると保証される。null チェック漏れがコンパイル時に見つかるわけだ。

### 標準ライブラリは Option だらけ

\`\`\`rust
let v = vec![10, 20, 30];
v.get(1);            // Some(&20)
v.get(9);            // None（範囲外でも panic しない）
v.first();           // Some(&10)
"abc".find('c');     // Some(2)
"42".parse::<i32>().ok();   // Some(42)
\`\`\`

## Option から値を取り出す

\`\`\`rust
let n: Option<i32> = Some(3);

// 1. match（すべての場合を書く。一番基本）
let doubled = match n {
    Some(v) => v * 2,
    None => 0,
};

// 2. if let（Some のときだけ何かする）
if let Some(v) = n {
    println!("値は {v}");
}

// 3. 既定値を指定して取り出す
n.unwrap_or(0);            // Some(3) → 3, None → 0
n.unwrap_or_default();     // None なら型の既定値（i32 は 0）

// 4. 中身を変換する（None は None のまま）
n.map(|v| v + 1);          // Some(4)
n.is_some();               // true
n.is_none();               // false
\`\`\`

| メソッド | Some(v) のとき | None のとき |
|---|---|---|
| \`unwrap()\` | v | **panic!** |
| \`expect("msg")\` | v | **panic!**（msg を表示） |
| \`unwrap_or(d)\` | v | d |
| \`unwrap_or_else(f)\` | v | f() の結果 |
| \`map(f)\` | Some(f(v)) | None |
| \`and_then(f)\` | f(v)（Option を返す関数） | None |
| \`filter(p)\` | p(&v) なら Some(v) | None |
| \`ok_or(e)\` | Ok(v) | Err(e) |

## unwrap の危険

\`unwrap()\` は「絶対 Some のはず」と決めつけて中身を取り出す。**None だったらプログラムが panic して止まる**。

\`\`\`rust
let v: Vec<i32> = Vec::new();
let first = v.first().unwrap();   // panic: called \`Option::unwrap()\` on a \`None\` value
\`\`\`

- 学習中やテスト、「論理的に絶対 None にならない」と説明できる場面以外では使わない
- 使うなら \`expect("理由")\` にすると、落ちたときに原因が分かりやすい
- 普段は \`match\` / \`if let\` / \`unwrap_or\` / \`?\`（第 17 章）で安全に扱う

unwrap を乱用すると、せっかく型で防いだ null 問題を自分で実行時エラーに戻してしまう。`,
    hints: [
      "enum は「どれか 1 つ」を表す型。バリアントごとに違うデータを持てる。",
      "Rust に null はない。値がないかもしれないなら `Option<T>`（`Some(v)` / `None`）。",
      "`Option<i32>` と `i32` は別の型なので、None の場合の処理を書かないと値を使えない。",
      "`unwrap()` は None で panic する。`match` / `if let` / `unwrap_or` を使おう。",
    ],
  },
  learn: {
    quiz: [
      {
        prompt: "構造体と enum の違いとして正しいのは？",
        choices: [
          "構造体は全フィールドを持ち、enum はバリアントのどれか 1 つ",
          "enum はデータを持てない",
          "構造体はメソッドを持てない",
          "違いはない",
        ],
        answer: "構造体は全フィールドを持ち、enum はバリアントのどれか 1 つ",
        explain:
          "構造体は「かつ」、enum は「または」。Rust の enum はバリアントごとにデータも持てる。",
      },
      {
        prompt: "次の enum の値を正しく作っているのは？",
        snippet: `enum Message {
    Quit,
    Move { x: i32, y: i32 },
    Write(String),
}`,
        choices: [
          "Message::Move { x: 1, y: 2 }",
          "Message.Move(1, 2)",
          "Move { 1, 2 }",
          "Message::Move(x: 1, y: 2)",
        ],
        answer: "Message::Move { x: 1, y: 2 }",
        explain:
          "名前付きフィールドのバリアントは構造体と同じ `{ x: .., y: .. }` で作る。パスは `::` でつなぐ。",
      },
      {
        prompt: "Rust に null がない代わりに、値がないかもしれないことを表すのは？",
        choices: ["Option<T>", "Result<T, E>", "Box<T>", "()"],
        answer: "Option<T>",
        explain: "`Option<T>` は `Some(T)` か `None`。Result は失敗の理由を持つ場合に使う。",
      },
      {
        prompt: "次のコードがコンパイルエラーになる理由は？",
        snippet: `let x: i32 = 5;
let y: Option<i32> = Some(5);
let z = x + y;`,
        choices: [
          "i32 と Option<i32> は別の型だから",
          "y が mut でないから",
          "Some は関数呼び出しが必要だから",
          "x の型注釈が不要だから",
        ],
        answer: "i32 と Option<i32> は別の型だから",
        explain:
          "Option から中身を取り出す（None の場合の扱いを決める）までは i32 として使えない。これが null 安全の仕組み。",
      },
      {
        prompt: "`let v: Vec<i32> = vec![]; v.first().unwrap();` を実行するとどうなる？",
        choices: ["panic して止まる", "0 が返る", "None が返る", "コンパイルエラー"],
        answer: "panic して止まる",
        explain:
          "`first()` は None を返し、None に `unwrap()` すると panic する。コンパイルは通ってしまう点に注意。",
      },
      {
        prompt: "`None::<i32>.unwrap_or(7)` と `Some(3).map(|v| v * 10)` の結果の組は？",
        choices: ["7 と Some(30)", "None と 30", "panic と Some(30)", "7 と 30"],
        answer: "7 と Some(30)",
        explain:
          "unwrap_or は None のとき既定値を返す。map は Some の中身だけを変換して Option のまま返す。",
      },
      {
        prompt: "`let b = None;` だけ書いたときに起きる問題は？",
        choices: [
          "型が推論できずエラーになる（Option<何> か分からない）",
          "null として扱われる",
          "自動で Option<i32> になる",
          "問題なし",
        ],
        answer: "型が推論できずエラーになる（Option<何> か分からない）",
        explain:
          "後で使い方から推論できなければ `let b: Option<i32> = None;` のように注釈が必要（E0282）。",
      },
    ],
  },
});
