import { defineProblem } from "../../../core/schemas";

export default defineProblem({
  id: "rust-learn-conversions",
  stage: "learn",
  language: "rust",
  scenario: "rust",
  copy: {
    title: "型変換（as / From / TryFrom / FromStr / AsRef）",
    prompt: `## Rust は勝手に型を変えない

JS では \`"3" * 2\` が \`6\` になったり、\`1 + "2"\` が \`"12"\` になったりと、型が暗黙に変わる。
Rust は **暗黙の型変換をほぼしない**。\`i32\` と \`i64\` を足すことすらできない。

\`\`\`rust
let a: i32 = 1;
let b: i64 = 2;
// let c = a + b;        // error[E0308]: mismatched types
let c = a as i64 + b;    // 明示的に変換する
\`\`\`

面倒に見えるが、「いつの間にか桁あふれ」「いつの間にか文字列連結」といったバグを防げる。変換の手段は目的別に何種類もある。

| 手段 | 用途 | 失敗する？ |
|---|---|---|
| \`as\` | 数値同士・char ⇔ 整数などのプリミティブ変換 | 失敗しないが、**値が切り捨て・折り返される** ことがある |
| \`From\` / \`Into\` | 情報を失わない変換（\`i32 → i64\`、\`&str → String\`） | 失敗しない |
| \`TryFrom\` / \`TryInto\` | 失敗しうる変換（\`i64 → u8\`） | \`Result\` を返す |
| \`FromStr\` / \`parse\` | 文字列から値を作る | \`Result\` を返す |
| \`AsRef\` | 参照として安く借りる（\`String\` → \`&str\`） | 失敗しない・コピーしない |
| \`to_string\` / \`to_owned\` | 所有する \`String\` などを作る | 失敗しない |

## as（プリミティブのキャスト）

\`\`\`rust
let x = 3.99_f64 as i32;    // 3   （小数点以下は切り捨て。四捨五入ではない）
let y = -2.7_f64 as i32;    // -2  （0 に向かって切り捨て）
let z = 300_i32 as u8;      // 44  （300 - 256。上位ビットが捨てられ折り返す）
let w = -1_i32 as u32;      // 4294967295（ビットの解釈が変わる）
let big = 1e20_f64 as i32;  // 2147483647（浮動小数→整数は範囲外なら端に張り付く）
let f = 7_i32 as f64 / 2.0; // 3.5
let c = 'A' as u32;         // 65  （char → コードポイント）
let d = 97_u8 as char;      // 'a' （u8 → char は as でできる）
let n = true as i32;        // 1
\`\`\`

- 整数の割り算を小数で行いたいときは \`a as f64 / b as f64\`
- **\`as\` は黙って値を壊すことがある**。範囲が心配なら後述の \`TryFrom\` を使う
- \`u32 as char\` はできない（無効なコードポイントがありうる）。\`char::from_u32(x)\` は \`Option<char>\` を返す
- 文字列 ⇔ 数値は \`as\` ではできない（\`error[E0605]\` / \`E0606\`）

## From と Into

\`From<T>\` は「T から自分を作る」変換。**失敗しない** ことが前提。

\`\`\`rust
let s = String::from("hi");   // &str → String
let n = i64::from(5_i32);     // i32 → i64（必ず収まる）
let v = Vec::from([1, 2, 3]); // 配列 → Vec
\`\`\`

**自作の型に From を実装すると、反対向きの \`Into\` が自動で使える**（標準ライブラリのブランケット実装 \`impl<T, U: From<T>> Into<U> for T\` のおかげ）。

\`\`\`rust
#[derive(Debug)]
struct Point { x: i32, y: i32 }

impl From<(i32, i32)> for Point {
    fn from(t: (i32, i32)) -> Self {
        Point { x: t.0, y: t.1 }
    }
}

let a = Point::from((1, 2));
let b: Point = (3, 4).into();   // Into は変換先の型を推論で決める（注釈が必要）
\`\`\`

- **実装するのは From、使うのは Into** が定石（From を実装すれば両方使える）
- \`into()\` は変換先が分からないと \`error[E0282]\` になるので、変数の型注釈や引数の型で決めてあげる
- 関数の引数を \`impl Into<String>\` にすると、\`&str\` も \`String\` も受け取れる

\`\`\`rust
fn greet(name: impl Into<String>) -> String {
    let name: String = name.into();
    format!("Hello, {}", name)
}
greet("Ann");                  // &str
greet(String::from("Bob"));    // String
\`\`\`

- \`?\` 演算子はエラーを返すとき \`From\` で変換する。\`impl From<ParseIntError> for MyError\` があれば、\`?\` が自動で変換してくれる

## TryFrom と TryInto

失敗しうる変換。**関連型 \`Error\`** で失敗時の型を決め、\`Result<Self, Self::Error>\` を返す。

\`\`\`rust
use std::convert::TryFrom; // edition 2021 以降は prelude にあるので不要

let ok: Result<u8, _> = u8::try_from(200_i32);  // Ok(200)
let ng: Result<u8, _> = u8::try_from(300_i32);  // Err(TryFromIntError(()))
let t: Result<u8, _> = 300_i32.try_into();      // TryInto 版
\`\`\`

自作の型でも範囲チェック付きの変換が書ける。

\`\`\`rust
#[derive(Debug)]
struct Percent(u8);

impl TryFrom<i32> for Percent {
    type Error = String;

    fn try_from(v: i32) -> Result<Self, Self::Error> {
        if (0..=100).contains(&v) {
            Ok(Percent(v as u8))   // 範囲を確かめたので as で安全に変換できる
        } else {
            Err(format!("out of range: {}", v))
        }
    }
}

let p: Result<Percent, String> = 50.try_into(); // Ok(Percent(50))
\`\`\`

From と同じく、**TryFrom を実装すれば TryInto も自動で使える**。

## FromStr と parse（文字列から値へ）

\`str::parse::<T>()\` は、T が \`FromStr\` を実装していれば使える。\`Result<T, T::Err>\` を返す。

\`\`\`rust
let a: i32 = "42".parse().unwrap();       // 型注釈で決める
let b = "3.5".parse::<f64>().unwrap();    // ターボフィッシュで決める
let c = "abc".parse::<i32>();             // Err(ParseIntError { kind: InvalidDigit })
let d = " 7 ".parse::<i32>();             // Err（空白は自動で取り除かれない → trim() する）
let e = "true".parse::<bool>();           // Ok(true)
let f = "x".parse::<char>();              // Ok('x')
\`\`\`

自作の型に \`FromStr\` を実装すれば \`parse\` が使えるようになる。

\`\`\`rust
use std::str::FromStr;

impl FromStr for Point {
    type Err = String;

    fn from_str(s: &str) -> Result<Self, Self::Err> {
        let (x, y) = s.split_once(',').ok_or("no comma")?;
        let x = x.trim().parse::<i32>().map_err(|_| "bad number")?;
        let y = y.trim().parse::<i32>().map_err(|_| "bad number")?;
        Ok(Point { x, y })
    }
}

let p: Point = "3,4".parse().unwrap();
\`\`\`

（\`?\` が \`&str\` を \`String\` に変換できるのは、\`impl From<&str> for String\` があるから）

## 数値 ⇔ 文字列

| やりたいこと | 書き方 | 結果 |
|---|---|---|
| 数値 → 文字列 | \`42.to_string()\` / \`format!("{}", 42)\` | \`"42"\` |
| 0 埋め・桁指定 | \`format!("{:03}", 7)\` / \`format!("{:.2}", 3.14159)\` | \`"007"\` / \`"3.14"\` |
| 2 / 16 進の文字列 | \`format!("{:b}", 5)\` / \`format!("{:x}", 255)\` | \`"101"\` / \`"ff"\` |
| 文字列 → 数値 | \`"42".parse::<i32>()\` | \`Ok(42)\` |
| 2 / 16 進の文字列 → 数値 | \`i32::from_str_radix("ff", 16)\` | \`Ok(255)\` |
| 数字の char → 数値 | \`'7'.to_digit(10)\` | \`Some(7)\` |
| 数値 → 数字の char | \`char::from_digit(7, 10)\` | \`Some('7')\` |

## AsRef（参照として借りる）

\`AsRef<T>\` は「\`&T\` として安く見られる」能力。コピーせずに参照を取り出す。
\`String\` も \`&str\` も \`AsRef<str>\` を実装しているので、両方を受け取る関数が書ける。

\`\`\`rust
fn shout<S: AsRef<str>>(s: S) -> String {
    s.as_ref().to_uppercase()   // as_ref() で &str を取り出す
}

shout("hi");                 // &str
shout(String::from("hey"));  // String
\`\`\`

ファイルパスを受け取る \`std::fs::read_to_string\` が \`AsRef<Path>\` を取るので、\`&str\` でも \`String\` でも \`PathBuf\` でも渡せる、というのが代表例。

| 引数の型 | 受け取れるもの | 中で得られるもの |
|---|---|---|
| \`&str\` | \`&str\`、\`&String\`（自動で参照外し） | \`&str\` |
| \`impl AsRef<str>\` | \`&str\`、\`String\`、\`&String\` | \`&str\`（借りるだけ） |
| \`impl Into<String>\` | \`&str\`、\`String\` | \`String\`（所有権を得る） |

## to_string と to_owned

どちらも \`&str\` から \`String\` を作れる。

\`\`\`rust
let a = "hi".to_string();     // Display を使った変換（どんな Display 型でも使える）
let b = "hi".to_owned();      // 借用から所有する値を作る（ToOwned トレイト）
let c = String::from("hi");   // From
let d: String = "hi".into();  // Into
\`\`\`

- 4 つとも結果は同じ \`String\`。好みで使い分けてよい
- \`to_owned\` は \`&[i32]\` → \`Vec<i32>\` のように **借用版から所有版を作る** 一般的な変換
- \`to_string\` は数値など **Display を実装した何でも** 文字列にできる

## まとめ

- \`as\` はプリミティブ専用。切り捨て・折り返しに注意
- 失敗しない変換は \`From\`（実装）/ \`Into\`（利用）
- 失敗しうる変換は \`TryFrom\` / \`TryInto\`。範囲チェックはこちら
- 文字列から値は \`parse\`（\`FromStr\`）。結果は \`Result\`
- 借りるだけなら \`AsRef\`、所有したいなら \`to_string\` / \`to_owned\` / \`into\``,
    hints: [
      "`as` は数値のキャスト。範囲外は切り捨て・折り返しが起きる。",
      "From を実装すると Into が自動で使える。失敗しうるなら TryFrom。",
      "文字列 → 値は `parse::<型>()` で Result が返る。自作型は FromStr を実装。",
      "AsRef<str> で &str と String の両方を借りて受け取れる。",
    ],
  },
  learn: {
    quiz: [
      {
        prompt: "`3.99_f64 as i32` の値は？",
        choices: ["3", "4", "3.99", "コンパイルエラー"],
        answer: "3",
        explain:
          "as による浮動小数→整数は 0 に向かって切り捨て。四捨五入したいなら `.round() as i32`。",
      },
      {
        prompt: "`300_i32 as u8` の値は？",
        choices: ["44", "255", "300", "panic する"],
        answer: "44",
        explain:
          "整数同士の as は上位ビットを捨てる（300 - 256 = 44）。範囲チェックしたいなら u8::try_from を使う。",
      },
      {
        prompt:
          "自作の型に `impl From<(i32, i32)> for Point` を書いたとき、追加で使えるようになるのは？",
        choices: [
          "(1, 2).into() で Point を作ること",
          "Point を (i32, i32) に戻すこと",
          '"1,2".parse::<Point>()',
          "Point as (i32, i32)",
        ],
        answer: "(1, 2).into() で Point を作ること",
        explain:
          "From を実装すると反対向きの Into がブランケット実装で自動的に使える。逆方向の変換や parse は別途実装が必要。",
      },
      {
        prompt: '`"42".parse::<i32>()` の戻り値の型は？',
        choices: ["Result<i32, ParseIntError>", "i32", "Option<i32>", "String"],
        answer: "Result<i32, ParseIntError>",
        explain: "文字列が数として正しいとは限らないので Result で返る。",
      },
      {
        prompt: '`" 7 ".parse::<i32>()` の結果は？',
        choices: ["Err(...)", "Ok(7)", "Ok(0)", "コンパイルエラー"],
        answer: "Err(...)",
        explain: 'parse は空白を取り除かない。`" 7 ".trim().parse::<i32>()` なら Ok(7)。',
      },
      {
        prompt: "範囲外になりうる i64 → u8 の変換で、失敗を Result で受け取れるのは？",
        choices: ["u8::try_from(x)", "x as u8", "u8::from(x)", "x.to_string()"],
        answer: "u8::try_from(x)",
        explain:
          "TryFrom は失敗時に Err を返す。as は黙って折り返し、From は i64 → u8 には実装されていない（失敗しうるので）。",
      },
      {
        prompt: "`fn f<S: AsRef<str>>(s: S)` に渡せないものは？",
        choices: ["42（i32）", '"hi"（&str）', 'String::from("hi")', '&String::from("hi")'],
        answer: "42（i32）",
        explain:
          "i32 は AsRef<str> を実装していない。&str・String・&String はどれも &str として借りられる。",
      },
      {
        prompt: '`let x = "5".parse().unwrap();` だけを書くとどうなる？',
        choices: [
          "型が決まらず E0282 などのエラー",
          "x は i32 になる",
          "x は String になる",
          "x は f64 になる",
        ],
        answer: "型が決まらず E0282 などのエラー",
        explain:
          "parse は何の型に変換するか分からないと使えない。`let x: i32 = ...` か `parse::<i32>()` で教える。",
      },
    ],
  },
});
