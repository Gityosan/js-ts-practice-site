import { defineProblem } from "../../../core/schemas";

export default defineProblem({
  id: "rust-learn-strings",
  stage: "learn",
  language: "rust",
  scenario: "rust",
  copy: {
    title: "String と文字列操作",
    prompt: `## String と &str の違い

Rust の文字列型は主に 2 つ。どちらも中身は **UTF-8 のバイト列**。

| | \`String\` | \`&str\` |
|---|---|---|
| 種類 | 所有する文字列（ヒープ上） | 文字列スライス（借用） |
| 変更 | \`let mut\` なら追加・削除できる | できない（読むだけ） |
| 長さ | 伸び縮みする | 固定 |
| 例 | \`String::from("hi")\`、\`format!(...)\` の結果 | \`"hi"\`（リテラル）、\`&s[0..2]\`、\`&s\` |
| 使いどころ | 文字列を作る・持ち続ける・返す | 文字列を受け取って読む（関数の引数） |

\`String\` は「\`Vec<u8>\` に UTF-8 であることの保証を付けたもの」と考えるとよい。
\`&String\` は自動で \`&str\` に変換されるので、**関数の引数は \`&str\`** にするのが基本。

## String の作り方

\`\`\`rust
let a = String::new();               // 空の String
let b = String::from("hello");       // リテラルから
let c = "hello".to_string();         // &str → String
let d = "hello".to_owned();          // 同じく &str → String
let e: String = "hello".into();      // 型が決まっていれば into() でも
let f = format!("{}-{}", "a", 1);    // 書式から作る: "a-1"
let g = String::with_capacity(100);  // 容量を先に確保（中身は空）
\`\`\`

逆に \`String\` → \`&str\` は \`&s\` や \`s.as_str()\`。

## 文字列を足す

\`\`\`rust
let mut s = String::from("foo");
s.push_str("bar");      // &str を末尾に追加 → "foobar"
s.push('!');            // char を 1 文字追加 → "foobar!"

let s1 = String::from("Hello, ");
let s2 = String::from("world");
let s3 = s1 + &s2;      // s1 は move されて使えなくなる。s2 は借用なので使える
// println!("{s1}");    // NG: E0382

let x = String::from("tic");
let y = String::from("tac");
let z = format!("{x}-{y}-toe");  // format! は何も move しない。一番読みやすい
\`\`\`

\`+\` 演算子は \`fn add(self, s: &str) -> String\` というメソッドで、**左辺の String の所有権を取り、右辺は &str を借りる**。
複数をつなげるときは \`format!\` の方が分かりやすい。

## len はバイト数

\`\`\`rust
let s = "hello";
println!("{}", s.len());             // 5
let j = "こんにちは";
println!("{}", j.len());             // 15（UTF-8 で 1 文字 3 バイト）
println!("{}", j.chars().count());   // 5（文字数）
\`\`\`

**文字数がほしいときは \`chars().count()\`**。\`len()\` はバイト数で、\`is_empty()\` は長さ 0 かどうか。

## 1 文字ずつ見る

文字列には \`s[0]\` のような添字アクセスが **できない**（UTF-8 では「n 文字目」の位置がすぐには分からないため）。代わりにイテレータを使う。

\`\`\`rust
let s = "aé日";
for c in s.chars() {          // char 単位: 'a', 'é', '日'
    print!("{c} ");
}
for b in s.bytes() {          // u8 単位: 97, 195, 169, 230, 151, 165
    print!("{b} ");
}
for (i, c) in s.char_indices() {  // (バイト位置, char): (0,'a') (1,'é') (3,'日')
    println!("{i}: {c}");
}
let third = s.chars().nth(2);     // Some('日')（n 文字目。先頭から数えるので O(n)）
let last = s.chars().last();      // Some('日')
\`\`\`

| メソッド | 1 回に取り出すもの | 用途 |
|---|---|---|
| \`chars()\` | \`char\` | 文字単位の処理（数える・反転・判定） |
| \`bytes()\` | \`u8\` | ASCII 前提の高速処理 |
| \`char_indices()\` | \`(usize, char)\` | 文字の位置でスライスしたいとき |

## よく使うメソッド

\`\`\`rust
let s = "  Hello, Rust World  ";
s.trim();                     // "Hello, Rust World"（前後の空白を除去）
s.trim_start(); s.trim_end(); // 片側だけ
s.to_uppercase();             // "  HELLO, RUST WORLD  "（新しい String）
s.to_lowercase();             // "  hello, rust world  "
s.contains("Rust");           // true
s.trim().starts_with("Hello");// true
s.trim().ends_with("World");  // true
s.replace("World", "!");      // "  Hello, Rust !  "（新しい String）
s.find("Rust");               // Some(9)（バイト位置）
"a,b,,c".split(',');          // "a", "b", "", "c" を順に返すイテレータ
"a  b\\tc".split_whitespace(); // "a", "b", "c"（連続する空白をまとめて区切る）
"l1\\nl2\\r\\nl3".lines();       // "l1", "l2", "l3"（改行で区切る）
"ab".repeat(3);               // "ababab"
\`\`\`

- \`split\` などは **イテレータ** を返す。\`for part in s.split(',') { }\` で回すか、\`.collect::<Vec<&str>>()\` で Vec にする
- \`to_uppercase\` / \`replace\` / \`repeat\` は元を変えずに **新しい String** を返す
- \`trim\` は元の一部を指す **&str** を返す（コピーしない）

## イテレータで組み立てる

\`\`\`rust
let s = "hello";
let rev: String = s.chars().rev().collect();             // "olleh"（文字単位で反転）
let n = s.chars().filter(|c| "aeiou".contains(*c)).count(); // 2（母音の数）
let words: Vec<&str> = "a b c".split(' ').collect();     // ["a", "b", "c"]
let joined = words.join("-");                           // "a-b-c"
\`\`\`

\`collect()\` は「イテレータの中身を集めて何かを作る」メソッド。\`String\` に集めれば文字列になる。
\`|c| ...\` は **クロージャ**（無名関数）で、イテレータの章で詳しく学ぶ。ここではループで書いても同じことができる。

文字列の反転は **必ず \`chars()\` 単位** で。バイト単位で反転すると UTF-8 が壊れる。

## 先頭の 1 文字だけ大文字にする

\`char\` の \`to_uppercase()\` は **イテレータ** を返す（ドイツ語の ß → SS のように 1 文字が複数文字になることがあるため）。

\`\`\`rust
fn capitalize(word: &str) -> String {
    let mut chars = word.chars();
    match chars.next() {
        Some(first) => first.to_uppercase().collect::<String>() + chars.as_str(),
        None => String::new(),
    }
}
// capitalize("rust") == "Rust"
\`\`\`

ASCII に限るなら \`first.to_ascii_uppercase()\` で char のまま変換できる。

## parse で数値に変換

\`\`\`rust
let n: i32 = "42".parse().unwrap();       // 42
let f: f64 = "3.14".parse().unwrap();     // 3.14
let bad = "abc".parse::<i32>();           // Err(...)（失敗）
let x = "abc".parse::<i32>().unwrap_or(0); // 失敗なら 0
let y: i32 = " 7 ".trim().parse().unwrap(); // 空白は trim してから
\`\`\`

\`parse\` の結果は \`Result\`（成功 \`Ok(値)\` か失敗 \`Err(エラー)\`）。

- \`.unwrap()\` … 成功なら中身、失敗なら panic
- \`.unwrap_or(既定値)\` … 失敗なら既定値
- \`if let Ok(n) = s.parse::<i32>() { ... }\` … 成功したときだけ処理

詳しくはエラー処理の章で扱う。

## 数値・文字 → 文字列

\`\`\`rust
let s = 42.to_string();          // "42"
let t = 'a'.to_string();         // "a"
let u = format!("{:05.1}", 3.14159); // "003.1"（幅 5・小数 1 桁・0 埋め）
\`\`\`

## 文字列の比較

\`==\` で中身を比べられる（\`String\` と \`&str\` の比較も OK）。\`<\` は辞書順（バイト順）。

\`\`\`rust
let s = String::from("abc");
println!("{}", s == "abc");      // true
println!("{}", "apple" < "banana"); // true
\`\`\``,
    hints: [
      "String は所有する可変の文字列、&str は借用したスライス。引数は &str が基本。",
      "len() はバイト数、文字数は chars().count()。添字 s[0] は使えない。",
      "連結は push_str / push / + / format!。`+` は左辺を move する。",
      "parse は Result を返す。型注釈か ::<型> で変換先を指定する。",
    ],
  },
  learn: {
    quiz: [
      {
        prompt: '`"日本語".len()` の値は？',
        choices: ["9", "3", "6", "12"],
        answer: "9",
        explain:
          "len() はバイト数。日本語は UTF-8 で 1 文字 3 バイトなので 9。文字数は chars().count() で 3。",
      },
      {
        prompt: "このコードの後で使え**ない**変数は？",
        snippet: `let s1 = String::from("a");
let s2 = String::from("b");
let s3 = s1 + &s2;
`,
        choices: ["s1", "s2", "s3", "全部使える"],
        answer: "s1",
        explain: "`+` は左辺の String の所有権を取る。右辺は &s2 で借用なので s2 は使える。",
      },
      {
        prompt: "`s.push('!')` と `s.push_str(\"!\")` の違いは？",
        choices: [
          "push は char を、push_str は &str を追加する",
          "push は先頭に、push_str は末尾に追加する",
          "push は新しい String を返し、push_str は元を変える",
          "違いはない",
        ],
        answer: "push は char を、push_str は &str を追加する",
        explain: "どちらも末尾に追加して元の String を変更する。引数の型が char か &str かの違い。",
      },
      {
        prompt: "このコードがコンパイルエラーになる理由は？",
        snippet: `let s = String::from("hello");
let c = s[0];
`,
        choices: [
          "String は整数の添字で文字を取り出せないから",
          "s が mut でないから",
          "0 ではなく 1 から数えるから",
          "c に型注釈がないから",
        ],
        answer: "String は整数の添字で文字を取り出せないから",
        explain:
          "UTF-8 では 1 文字のバイト数が一定でないため、添字アクセスは禁止されている。`s.chars().nth(0)` を使う。",
      },
      {
        prompt: '"こんにちは" を正しく反転して "はちにんこ" を作る方法は？',
        choices: [
          "s.chars().rev().collect::<String>()",
          "s.bytes().rev().collect::<Vec<u8>>() を String にする",
          "s.reverse()",
          "&s[s.len()..0]",
        ],
        answer: "s.chars().rev().collect::<String>()",
        explain:
          "char 単位で反転すれば UTF-8 を壊さない。バイト単位で反転すると不正な UTF-8 になる。&str に reverse メソッドはない。",
      },
      {
        prompt: '`"  a b  ".trim()` の戻り値の型と値は？',
        choices: ['&str の "a b"', 'String の "a b"', '&str の "ab"', 'String の "ab"'],
        answer: '&str の "a b"',
        explain:
          "trim は前後の空白だけを除いた元の文字列の一部を &str で返す（コピーしない）。中の空白は残る。",
      },
      {
        prompt: '`"12x".parse::<i32>().unwrap_or(-1)` の値は？',
        choices: ["-1", "12", "panic する", "0"],
        answer: "-1",
        explain: '"12x" は整数として解釈できないので parse は Err。unwrap_or で既定値 -1 になる。',
      },
      {
        prompt: "`\"a,b,,c\".split(',')` で得られる要素の数は？",
        choices: ["4", "3", "5", "2"],
        answer: "4",
        explain:
          '"a", "b", "", "c" の 4 つ。区切り文字が連続すると空文字が入る。空白区切りで空を飛ばしたいなら split_whitespace。',
      },
    ],
  },
});
