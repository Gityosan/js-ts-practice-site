import { defineProblem } from "../../../core/schemas";

export default defineProblem({
  id: "rust-learn-custom-errors",
  stage: "learn",
  language: "rust",
  scenario: "rust",
  copy: {
    title: "独自エラー型（Display / Error / From / Box<dyn Error>）",
    prompt: `## なぜ独自のエラー型を作るのか

前章では \`Result<T, String>\` でエラーを返した。手軽だが、文字列だと呼び出し側が **エラーの種類で処理を分けられない**（文字列を比較するしかない）。

\`\`\`rust
// 文字列のエラー: 「残高不足」なのか「口座凍結」なのか、文字列を見ないと分からない
fn withdraw(amount: u64) -> Result<u64, String> { /* ... */ }
\`\`\`

そこで **enum でエラーの種類を列挙** する。match で種類ごとに処理でき、必要な情報（足りない金額など）も持たせられる。

\`\`\`rust
#[derive(Debug, PartialEq)]
enum BankError {
    InsufficientFunds { needed: u64, available: u64 },
    AccountFrozen,
    InvalidAmount,
}

fn withdraw(balance: u64, amount: u64) -> Result<u64, BankError> {
    if amount == 0 {
        return Err(BankError::InvalidAmount);
    }
    if amount > balance {
        return Err(BankError::InsufficientFunds { needed: amount, available: balance });
    }
    Ok(balance - amount)
}

match withdraw(100, 150) {
    Ok(rest) => println!("残高 {rest}"),
    Err(BankError::InsufficientFunds { needed, available }) => {
        println!("{} 足りません", needed - available)
    }
    Err(e) => println!("その他のエラー: {e:?}"),
}
\`\`\`

- \`#[derive(Debug)]\` は付けておく（\`unwrap\` や \`main\` の Err 表示で必要）
- \`PartialEq\` があるとテストで \`assert_eq!(r, Err(BankError::AccountFrozen))\` と比べられる

## Display を実装する（人間向けのメッセージ）

\`{:?}\`（Debug）は開発者向け。利用者に見せるメッセージは \`{}\`（**Display**）で出す。Display は derive できないので自分で実装する。

\`\`\`rust
use std::fmt;

impl fmt::Display for BankError {
    fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
        match self {
            BankError::InsufficientFunds { needed, available } => {
                write!(f, "残高不足: {needed} 円必要ですが {available} 円しかありません")
            }
            BankError::AccountFrozen => write!(f, "口座が凍結されています"),
            BankError::InvalidAmount => write!(f, "金額が不正です"),
        }
    }
}

let e = BankError::AccountFrozen;
println!("{e}");            // 口座が凍結されています
let s = e.to_string();      // Display を実装すると to_string() も使える
\`\`\`

- \`write!(f, "...", 値)\` は \`format!\` と同じ書式で \`f\` に書き込み、\`fmt::Result\` を返す
- Display を実装した型は自動的に \`to_string()\` が使える（\`ToString\` が自動実装される）

## std::error::Error を実装する

\`std::error::Error\` は「これはエラー型です」という標準のトレイト。**Debug と Display を実装していれば、中身は空で実装できる**。

\`\`\`rust
impl std::error::Error for BankError {}
\`\`\`

これを実装すると:

- \`Box<dyn Error>\` に入れられる（後述）
- 他のライブラリのエラーと同じように扱える
- \`source()\` メソッドで「原因となった下位のエラー」を返すこともできる（任意）

## From でエラーを変換して ? を使う

複数の種類の失敗が起こる関数では、エラー型を 1 つにまとめる必要がある。

\`\`\`rust
use std::num::ParseIntError;

#[derive(Debug)]
enum ConfigError {
    Parse(ParseIntError),      // 下位のエラーを包む
    OutOfRange(i64),
}

fn parse_port(s: &str) -> Result<u16, ConfigError> {
    let n: i64 = s.parse()?;   // ParseIntError → ConfigError に自動変換したい
    if !(1..=65535).contains(&n) {
        return Err(ConfigError::OutOfRange(n));
    }
    Ok(n as u16)
}
\`\`\`

このままだと \`?\` の行でエラー（ParseIntError を ConfigError として返せない）。\`?\` は Err のとき **\`From::from(e)\` で戻り値のエラー型に変換** してから return するので、**\`From\` を実装** すればよい。

\`\`\`rust
impl From<ParseIntError> for ConfigError {
    fn from(e: ParseIntError) -> Self {
        ConfigError::Parse(e)
    }
}
\`\`\`

これで \`s.parse()?\` が自動で \`ConfigError::Parse(..)\` に包まれる。

| \`?\` が展開されるイメージ |
|---|
| \`match expr { Ok(v) => v, Err(e) => return Err(From::from(e)) }\` |

## map_err — その場で変換する

From を実装するほどでもないとき、または **文脈（どの行・どの項目か）を付け足したい** ときは \`map_err\` で Err の中身だけを変換する。

\`\`\`rust
fn parse_age(s: &str) -> Result<u8, String> {
    s.trim()
        .parse::<u8>()
        .map_err(|e| format!("年齢 '{s}' を読めません: {e}"))
}

fn parse_line(no: usize, line: &str) -> Result<i32, ConfigError> {
    line.parse::<i32>().map_err(|_| ConfigError::BadLine(no))?;
    // ...
}
\`\`\`

\`map_err\` は Ok のときは何もせず、Err(e) を Err(f(e)) にする。

## Box<dyn Error> — どんなエラーでも入れられる箱

\`Box<dyn std::error::Error>\` は「Error トレイトを実装した **何らかの** エラー」を表す型（トレイトオブジェクト）。いちいちエラー enum を作らずに、種類の違うエラーを \`?\` でそのまま返せる。

\`\`\`rust
use std::error::Error;

fn run(path: &str) -> Result<i32, Box<dyn Error>> {
    let text = std::fs::read_to_string(path)?;   // io::Error
    let n: i32 = text.trim().parse()?;            // ParseIntError
    if n < 0 {
        return Err("負の数は不可".into());        // &str / String からも作れる
    }
    Ok(n)
}

fn main() -> Result<(), Box<dyn Error>> {
    let n = run("number.txt")?;
    println!("{n}");
    Ok(())
}
\`\`\`

- 標準のエラー型は全部 Error を実装しているので、\`?\` で自動的に Box に詰められる
- 文字列からは \`"メッセージ".into()\` や \`Box::from(format!(...))\` で作れる
- 自作の型も \`impl Error for MyError {}\` していれば入る
- 欠点: 呼び出し側は \`e.to_string()\` で表示はできるが、**種類で match しにくい**（\`e.downcast_ref::<MyError>()\` で取り出すことはできる）

## エラー設計の考え方

| 状況 | おすすめ |
|---|---|
| 小さなスクリプト・main・プロトタイプ | \`Box<dyn Error>\`（手軽） |
| ライブラリ・呼び出し側が種類で分岐したい | 独自の **エラー enum** + Display + Error + From |
| 失敗理由が不要 | \`Option\` |
| バグ・前提違反 | \`panic!\` |

- エラーの種類は「**呼び出し側が違う対応をするもの**」ごとに分ける（細かすぎても使いにくい）
- 原因の情報（どの値・どの行・下位エラー）を **バリアントに持たせる**
- Display のメッセージは利用者が読んで分かる文に。小文字始まり・句点なしが Rust 界隈の慣習（日本語ならそこまで気にしなくてよい）
- 実務では \`thiserror\`（enum 用の derive）や \`anyhow\`（Box<dyn Error> の強化版）というクレートがよく使われるが、中でやっていることはこの章の内容そのもの`,
    hints: [
      "エラーの種類を enum で表すと、呼び出し側が match で処理を分けられる。",
      "利用者向けメッセージは `impl fmt::Display`、`impl std::error::Error for T {}` で標準のエラー型の仲間になる。",
      "`impl From<下位エラー> for 自作エラー` を書くと `?` が自動で変換してくれる。その場の変換は `map_err`。",
      "`Box<dyn Error>` はどんなエラーでも入る手軽な箱。ライブラリでは独自 enum が向く。",
    ],
  },
  learn: {
    quiz: [
      {
        prompt: "エラーを String ではなく enum で表す主な利点は？",
        choices: [
          "呼び出し側がエラーの種類で match して処理を分けられる",
          "実行が速くなる",
          "panic しなくなる",
          "Display を実装しなくてよくなる",
        ],
        answer: "呼び出し側がエラーの種類で match して処理を分けられる",
        explain:
          "文字列だと比較でしか判別できない。enum ならバリアントで分岐でき、追加情報も持てる。",
      },
      {
        prompt: '`println!("{}", err)` で独自エラーを表示するのに必要なのは？',
        choices: [
          "impl fmt::Display for 型",
          "#[derive(Display)]",
          "#[derive(Debug)] だけ",
          "impl From<String> for 型",
        ],
        answer: "impl fmt::Display for 型",
        explain: "`{}` は Display。derive はできないので fmt メソッドを自分で書く。",
      },
      {
        prompt: "`impl std::error::Error for MyError {}` を書くために MyError が満たすべき条件は？",
        choices: [
          "Debug と Display を実装していること",
          "Clone を実装していること",
          "PartialEq を実装していること",
          "条件はない",
        ],
        answer: "Debug と Display を実装していること",
        explain:
          "Error トレイトは Debug + Display を前提（スーパートレイト）にしている。メソッドは既定実装があるので中身は空でよい。",
      },
      {
        prompt: "次のコードの `?` が動くために必要なのは？",
        snippet: `fn f(s: &str) -> Result<i32, AppError> {
    let n: i32 = s.parse()?;  // ParseIntError
    Ok(n)
}`,
        choices: [
          "impl From<ParseIntError> for AppError",
          "impl From<AppError> for ParseIntError",
          "impl Display for ParseIntError",
          "何もいらない",
        ],
        answer: "impl From<ParseIntError> for AppError",
        explain: "? は Err(e) を `From::from(e)` で戻り値のエラー型に変換して返す。",
      },
      {
        prompt: '`"x".parse::<i32>().map_err(|e| e.to_string())` の型は？',
        choices: ["Result<i32, String>", "Result<String, ParseIntError>", "Option<i32>", "String"],
        answer: "Result<i32, String>",
        explain: "map_err は Err の中身だけを変換する。Ok 側の型（i32）はそのまま。",
      },
      {
        prompt: "`Result<T, Box<dyn Error>>` を返す関数について正しいのは？",
        choices: [
          "io::Error や ParseIntError など異なるエラーを ? でそのまま返せる",
          "自作エラーは入れられない",
          "文字列からは作れない",
          "呼び出し側で種類ごとに簡単に match できる",
        ],
        answer: "io::Error や ParseIntError など異なるエラーを ? でそのまま返せる",
        explain:
          'Error を実装した型なら何でも入る。`"msg".into()` でも作れる。種類での分岐は downcast が必要で手間。',
      },
      {
        prompt: "Display を実装した型で自動的に使えるようになるメソッドは？",
        choices: ["to_string()", "clone()", "unwrap()", "into_iter()"],
        answer: "to_string()",
        explain: "Display を実装すると ToString が自動実装され、`e.to_string()` で文字列にできる。",
      },
    ],
  },
});
