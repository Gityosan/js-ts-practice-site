import { defineProblem } from "../../../core/schemas";

export default defineProblem({
  id: "rust-learn-error-handling",
  stage: "learn",
  language: "rust",
  scenario: "rust",
  copy: {
    title: "エラー処理（panic! / Result / ? 演算子）",
    prompt: `## Rust のエラーは 2 種類

Rust には **例外（try / catch）がない**。エラーを次の 2 つに分けて扱う。

| 種類 | 例 | 扱い方 |
|---|---|---|
| **回復不能**（バグ） | 配列の範囲外アクセス、あり得ない状態 | \`panic!\` でプログラム（スレッド）を止める |
| **回復可能**（想定内の失敗） | ファイルがない、入力が数字でない | \`Result<T, E>\` を返して呼び出し側に判断させる |

JS では両方とも \`throw\` で投げ、どの関数が投げるかは見た目では分からない。Rust では **失敗しうる関数は戻り値の型に \`Result\` と書かれる** ので、エラー処理を忘れるとコンパイラ（や warning）が気づかせてくれる。

## panic! — 回復不能なエラー

\`\`\`rust
fn main() {
    panic!("もうだめだ");
}
// thread 'main' panicked at src/main.rs:2:5:
// もうだめだ
\`\`\`

panic は次のような場面で起きる。

\`\`\`rust
let v = vec![1, 2, 3];
v[99];                   // index out of bounds で panic
let n: Option<i32> = None;
n.unwrap();              // None の unwrap で panic
let x = 10 / zero;       // 0 除算で panic
let m: u8 = 255 + one;   // デバッグビルドではオーバーフローで panic
\`\`\`

- panic すると、そのスレッドのスタックを巻き戻して（unwind）後片付けし、終了する
- 環境変数 \`RUST_BACKTRACE=1\` で呼び出し履歴（バックトレース）が見られる
- 関連マクロ: \`unreachable!()\`（ここには来ないはず）、\`todo!()\`（未実装）、\`assert!(条件)\` / \`assert_eq!(a, b)\`（条件が偽なら panic）

### いつ panic してよいか

- プログラムのバグ（前提条件・不変条件が破れた）を見つけたとき
- サンプルコード・プロトタイプ・テスト
- 「論理的に絶対に失敗しない」と言えるとき（例: \`"127.0.0.1".parse::<IpAddr>().unwrap()\` のような固定値）

ユーザー入力やファイル・ネットワークのように **失敗が普通に起こりうるもの** は panic ではなく Result で返す。

## Result<T, E> — 回復可能なエラー

\`\`\`rust
enum Result<T, E> {
    Ok(T),    // 成功。T 型の値を持つ
    Err(E),   // 失敗。E 型のエラー情報を持つ
}
\`\`\`

Option と同じく prelude に入っているので \`Ok(..)\` / \`Err(..)\` と書ける。Option が「ない」理由を持たないのに対し、Result は **なぜ失敗したか** を \`E\` で伝えられる。

\`\`\`rust
fn divide(a: i32, b: i32) -> Result<i32, String> {
    if b == 0 {
        return Err(String::from("0 では割れません"));
    }
    Ok(a / b)
}

let r1 = divide(10, 2);   // Ok(5)
let r2 = divide(1, 0);    // Err("0 では割れません")
\`\`\`

標準ライブラリの例:

\`\`\`rust
"42".parse::<i32>();               // Ok(42)
"abc".parse::<i32>();              // Err(ParseIntError { kind: InvalidDigit })
std::fs::read_to_string("a.txt");  // Result<String, std::io::Error>
\`\`\`

## match で処理する

\`\`\`rust
match "42".parse::<i32>() {
    Ok(n) => println!("数値: {n}"),
    Err(e) => println!("変換できません: {e}"),   // e は ParseIntError（Display で表示できる）
}
\`\`\`

エラーの種類ごとに分けることもできる。

\`\`\`rust
use std::fs::File;
use std::io::ErrorKind;

let f = match File::open("hello.txt") {
    Ok(file) => file,
    Err(e) => match e.kind() {
        ErrorKind::NotFound => File::create("hello.txt").expect("作成に失敗"),
        other => panic!("開けない: {other:?}"),
    },
};
\`\`\`

## Result の便利メソッド

| メソッド | Ok(v) のとき | Err(e) のとき |
|---|---|---|
| \`unwrap()\` | v | **panic**（e を表示） |
| \`expect("msg")\` | v | **panic**（msg と e を表示） |
| \`unwrap_or(d)\` | v | d |
| \`unwrap_or_else(|e| ...)\` | v | クロージャの結果 |
| \`unwrap_or_default()\` | v | 型の既定値 |
| \`is_ok()\` / \`is_err()\` | true / false | false / true |
| \`ok()\` | Some(v) | None（エラー情報は捨てる） |
| \`map(f)\` | Ok(f(v)) | Err(e) のまま |
| \`map_err(f)\` | Ok(v) のまま | Err(f(e))（次章） |
| \`and_then(f)\` | f(v)（Result を返す関数） | Err(e) |

Option からは \`opt.ok_or(err)\` / \`opt.ok_or_else(|| err)\` で Result に変換できる。

## unwrap と expect

\`\`\`rust
let n: i32 = "42".parse().unwrap();                 // 失敗したら panic
let n: i32 = "42".parse().expect("設定値が数値でない"); // 失敗時のメッセージを指定
\`\`\`

\`expect\` には「**なぜ成功するはずなのか**」や「何を期待していたか」を書くと、panic したときに原因を追いやすい。本番コードでは unwrap より expect が好まれる。

## ? 演算子 — エラーを呼び出し元に伝える

失敗したらそのまま呼び出し元にエラーを返す（**伝播 / propagate**）処理を match で書くと長くなる。

\`\`\`rust
use std::num::ParseIntError;

fn add_strs(a: &str, b: &str) -> Result<i32, ParseIntError> {
    let x = match a.parse::<i32>() {
        Ok(v) => v,
        Err(e) => return Err(e),
    };
    let y = match b.parse::<i32>() {
        Ok(v) => v,
        Err(e) => return Err(e),
    };
    Ok(x + y)
}
\`\`\`

**\`?\`** を付けると同じ意味になる。

\`\`\`rust
fn add_strs(a: &str, b: &str) -> Result<i32, ParseIntError> {
    let x = a.parse::<i32>()?;   // Ok なら中身を取り出し、Err なら即 return Err(..)
    let y = b.parse::<i32>()?;
    Ok(x + y)
}

// つなげて書くこともできる
fn read_username() -> Result<String, std::io::Error> {
    let s = std::fs::read_to_string("user.txt")?;
    Ok(s.trim().to_string())
}
\`\`\`

- \`式?\` は「Ok(v) なら v、Err(e) なら関数から \`return Err(e.into())\`」
- **戻り値が Result（または Option）の関数の中でしか使えない**。\`fn foo() -> i32\` の中で \`?\` を書くとエラー（E0277）
- \`.into()\` が呼ばれるので、\`From\` を実装すればエラー型を自動変換できる（次章）
- メソッドチェーン \`s.trim().parse::<i32>()?.abs()\` のように途中に書ける

## main から Result を返す

\`main\` の戻り値を Result にすると、main の中でも \`?\` が使える。

\`\`\`rust
use std::num::ParseIntError;

fn main() -> Result<(), ParseIntError> {
    let n: i32 = "42".parse()?;
    println!("{n}");
    Ok(())                     // 成功したら Ok(()) を返す
}
\`\`\`

- Err を返すと、エラーを Debug 表示して **終了コード 1** で終わる
- どんなエラーでも返せるように \`Result<(), Box<dyn std::error::Error>>\` にすることが多い（次章）

## Option でも ? が使える

戻り値が Option の関数の中では、Option に \`?\` を付けると「None なら即 return None」になる。

\`\`\`rust
fn last_char_of_first_line(text: &str) -> Option<char> {
    text.lines().next()?.chars().last()
}
// "hello\\nworld" → Some('o')
// ""             → None（lines().next() が None）
\`\`\`

ただし **Result の関数で Option に ? はそのまま使えない**（逆も同じ）。\`opt.ok_or(...)?\` や \`res.ok()?\` で変換してから使う。

## まとめ: どう選ぶ？

- バグ・前提違反 → \`panic!\` / \`unwrap\` / \`expect\`
- 失敗が起こりうる → \`Result<T, E>\` を返す
- 「ない」だけで理由が要らない → \`Option<T>\`
- その場で処理する → \`match\` / \`unwrap_or\` など
- 呼び出し元に任せる → \`?\``,
    hints: [
      "回復不能なバグは `panic!`、起こりうる失敗は `Result<T, E>` を返す。Rust に例外はない。",
      "`unwrap` / `expect` は Err（None）で panic する。`expect` には理由を書く。",
      "`?` は Err なら即 return、Ok なら中身を取り出す。戻り値が Result / Option の関数の中だけで使える。",
      "`fn main() -> Result<(), E>` にすると main でも `?` が使える。",
    ],
  },
  learn: {
    quiz: [
      {
        prompt:
          "ユーザーが入力した文字列を数値に変換する関数が失敗しうるとき、ふさわしい戻り値は？",
        choices: ["Result<i32, エラー型>", "i32（失敗時は panic!）", "i32（失敗時は -1）", "()"],
        answer: "Result<i32, エラー型>",
        explain:
          "入力の誤りは想定内の失敗なので Result で返して呼び出し側に判断させる。-1 のような特別な値はバグの元。",
      },
      {
        prompt: '`"abc".parse::<i32>().unwrap()` を実行すると？',
        choices: ["panic する", "0 が返る", "Err が返る", "コンパイルエラー"],
        answer: "panic する",
        explain: "parse は Err を返し、Err に unwrap すると panic する。",
      },
      {
        prompt: "次の 2 つの関数について正しいのは？",
        snippet: `fn f(s: &str) -> Result<i32, ParseIntError> {
    let n = s.parse::<i32>()?;
    Ok(n * 2)
}`,
        choices: [
          "parse が Err なら f はその Err をすぐ返す",
          "parse が Err なら panic する",
          "parse が Err なら n は 0 になる",
          "? は Option にしか使えない",
        ],
        answer: "parse が Err なら f はその Err をすぐ返す",
        explain: "? は Err を呼び出し元に伝播する（早期 return）。",
      },
      {
        prompt: "次のコードがコンパイルエラーになる理由は？",
        snippet: `fn double(s: &str) -> i32 {
    let n: i32 = s.parse()?;
    n * 2
}`,
        choices: [
          "戻り値が Result / Option でない関数で ? を使っているから",
          "parse に型注釈が必要だから",
          "n が mut でないから",
          "* 2 が使えないから",
        ],
        answer: "戻り値が Result / Option でない関数で ? を使っているから",
        explain:
          "? は Err を return するので、戻り値の型が Result（または Option）である必要がある（E0277）。",
      },
      {
        prompt: "main で ? を使いたい。main のシグネチャは？",
        choices: [
          "fn main() -> Result<(), Box<dyn std::error::Error>>",
          "fn main() -> i32",
          "fn main(?)",
          "main では ? は使えない",
        ],
        answer: "fn main() -> Result<(), Box<dyn std::error::Error>>",
        explain: "main は Result を返せる。最後に Ok(()) を返す。Err なら終了コード 1。",
      },
      {
        prompt:
          "`fn f(t: &str) -> Option<char> { t.lines().next()?.chars().next() }` で t が空文字列のときは？",
        choices: ["None", "panic", "Some(' ')", "コンパイルエラー"],
        answer: "None",
        explain:
          "lines().next() が None なので ? で即 None を返す。Option を返す関数では Option に ? が使える。",
      },
      {
        prompt:
          '`Ok::<i32, String>(3).map(|v| v + 1)` と `Err::<i32, String>("x".into()).unwrap_or(0)` の結果は？',
        choices: ["Ok(4) と 0", '4 と Err("x")', "Ok(4) と panic", "Ok(3) と 0"],
        answer: "Ok(4) と 0",
        explain: "map は Ok の中身だけ変換する。unwrap_or は Err のとき既定値を返す。",
      },
      {
        prompt: '`expect("msg")` が `unwrap()` より好まれる理由は？',
        choices: [
          "panic したときに意図や原因が分かるメッセージを出せるから",
          "panic しないから",
          "速いから",
          "Err を Ok に変換するから",
        ],
        answer: "panic したときに意図や原因が分かるメッセージを出せるから",
        explain: "どちらも失敗時に panic するが、expect は独自メッセージを添えられる。",
      },
    ],
  },
});
