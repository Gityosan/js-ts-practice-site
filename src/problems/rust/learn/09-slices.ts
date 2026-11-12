import { defineProblem } from "../../../core/schemas";

export default defineProblem({
  id: "rust-learn-slices",
  stage: "learn",
  language: "rust",
  scenario: "rust",
  copy: {
    title: "スライス（&str と &[T]）",
    prompt: `## スライスとは

**スライス** は、配列・ベクタ・文字列などの **連続した要素の一部（または全部）を指す参照**。
所有権は持たない「窓」のようなもので、元のデータをコピーせずに一部分を扱える。

| スライス型 | 指す先 | 例 |
|---|---|---|
| \`&[T]\` | 配列 \`[T; N]\` や \`Vec<T>\` の一部 | \`&[i32]\` |
| \`&str\` | \`String\` や文字列リテラルの一部（UTF-8 のバイト列） | \`&str\` |

スライスの中身は「先頭へのポインタ」と「長さ」の 2 つだけ（**ファットポインタ** と呼ばれる）。

\`\`\`text
let a = [10, 20, 30, 40, 50];
let s = &a[1..4];

s:  ptr ─┐  len = 3
         v
a:  [10, 20, 30, 40, 50]
         ^^^^^^^^^^
\`\`\`

## 範囲指定 \`[a..b]\`

\`\`\`rust
let a = [10, 20, 30, 40, 50];
let s1 = &a[1..4];   // [20, 30, 40]  … 添字 1 以上 4 未満
let s2 = &a[..2];    // [10, 20]      … 先頭から 2 未満
let s3 = &a[3..];    // [40, 50]      … 3 から最後まで
let s4 = &a[..];     // 全体
let s5 = &a[1..=3];  // [20, 30, 40]  … 3 を含む
let s6 = &a[2..2];   // []            … 空のスライス（OK）
\`\`\`

- 範囲の書き方は for ループの範囲と同じ
- 範囲が長さを超える（\`&a[3..10]\`）、または開始 > 終了（\`&a[3..1]\`）だと **panic**
- スライスにも \`len()\`、\`is_empty()\`、添字 \`s[0]\`、\`for x in s\`、\`first()\`、\`last()\`、\`contains(&x)\`、\`iter()\` などが使える

## &[T]: 配列やベクタの一部

\`\`\`rust
fn sum(nums: &[i32]) -> i32 {
    let mut total = 0;
    for n in nums {      // n は &i32
        total += n;      // &i32 + i32 はそのまま足せる（*n でもよい）
    }
    total
}

fn main() {
    let arr = [1, 2, 3, 4];
    let v = vec![10, 20, 30];
    println!("{}", sum(&arr));        // 10 … 配列全体
    println!("{}", sum(&v));          // 60 … Vec 全体
    println!("{}", sum(&arr[1..3]));  // 5  … 一部だけ
}
\`\`\`

\`&[i32; 4]\`（配列の参照）や \`&Vec<i32>\`（ベクタの参照）は、自動的に \`&[i32]\` に変換されて渡せる（**型強制 / deref coercion**）。
だから引数を \`&[T]\` にしておくと、**配列でもベクタでもその一部でも受け取れる** 汎用的な関数になる。

### 可変スライス \`&mut [T]\`

\`\`\`rust
fn zero_out(nums: &mut [i32]) {
    for n in nums.iter_mut() {
        *n = 0;
    }
}

let mut a = [1, 2, 3, 4];
zero_out(&mut a[1..3]);
println!("{:?}", a);   // [1, 0, 0, 4]
\`\`\`

## &str: 文字列スライス

\`\`\`rust
let s = String::from("hello world");
let hello = &s[0..5];   // "hello"
let world = &s[6..11];  // "world"
\`\`\`

**文字列リテラルの型は \`&str\`**。\`let s = "hi";\` の \`s\` は、プログラムのバイナリに埋め込まれた文字列を指すスライス（だから不変）。

### 添字は「バイト位置」、UTF-8 の境界に注意

Rust の文字列は **UTF-8**。ASCII は 1 文字 1 バイトだが、日本語はふつう **1 文字 3 バイト**。

\`\`\`rust
let s = "こんにちは";
println!("{}", s.len());   // 15（バイト数）
let a = &s[0..3];          // "こ"
let b = &s[0..2];          // panic: byte index 2 is not a char boundary
\`\`\`

文字の途中で切ると panic する。安全に「先頭から n 文字」を取りたいときは、\`char_indices()\` で文字の境界のバイト位置を調べる。

\`\`\`rust
fn first_chars(s: &str, n: usize) -> &str {
    for (count, (i, _)) in s.char_indices().enumerate() {
        if count == n {
            return &s[..i];   // n 文字目が始まるバイト位置で切る
        }
    }
    s                         // n 文字未満なら全体
}
\`\`\`

- \`s.is_char_boundary(i)\` で、バイト位置 i が文字の境界かどうか調べられる
- \`s[0]\` のような **1 つの添字で文字を取ることはできない**（コンパイルエラー）。\`s.chars().nth(0)\` を使う

## なぜスライスを返すと安全なのか: first_word

「文字列の最初の単語」を返す関数を考える。

\`\`\`rust
fn first_word(s: &str) -> &str {
    let bytes = s.as_bytes();             // &[u8]
    for (i, &b) in bytes.iter().enumerate() {
        if b == b' ' {
            return &s[..i];
        }
    }
    &s[..]
}
\`\`\`

もし単語の終わりの **添字（usize）** を返す設計だと、元の文字列が後で \`clear()\` されても添字だけ残り、ずれた値を使うバグになる。
スライスを返せば、それは元の文字列の **借用** なので、借用中に元の文字列を変更するコードはコンパイルエラーになる。

\`\`\`rust
let mut s = String::from("hello world");
let word = first_word(&s);
s.clear();              // NG: E0502 word が借用中
println!("{word}");
\`\`\`

## 引数に &str / &[T] を取る理由

| 引数の型 | 受け取れるもの |
|---|---|
| \`&String\` | \`String\` の参照だけ |
| **\`&str\`** | \`&String\`、文字列リテラル \`"abc"\`、他の \`&str\` の一部 \`&s[1..3]\` |
| \`&Vec<T>\` | \`Vec\` の参照だけ |
| **\`&[T]\`** | \`&Vec<T>\`、配列の参照 \`&[1, 2, 3]\`、その一部 \`&v[1..]\` |

**読むだけの引数は \`&String\` ではなく \`&str\`、\`&Vec<T>\` ではなく \`&[T]\` にする** のが Rust の定番。
より多くの種類の値を受け取れて、呼び出し側が無駄に \`String\` や \`Vec\` を作らなくて済む。

## スライスの便利メソッド（一部）

\`\`\`rust
let v = [3, 1, 4, 1, 5];
v.len();               // 5
v.first();             // Some(&3)
v.last();              // Some(&5)
v.contains(&4);        // true
let (l, r) = v.split_at(2); // ([3, 1], [4, 1, 5])
v.iter().max();        // Some(&5)
v.to_vec();            // スライスをコピーして Vec<i32> を作る
\`\`\``,
    hints: [
      "スライスは連続した一部分への参照。`&a[1..3]`、`&s[..5]` のように作る。",
      "&str の範囲はバイト位置。UTF-8 の文字の途中で切ると panic。",
      "読むだけの引数は &String より &str、&Vec<T> より &[T] にすると何でも受け取れる。",
      "スライスを返すと元のデータの借用になり、元データの変更をコンパイラが防ぐ。",
    ],
  },
  learn: {
    quiz: [
      {
        prompt: "`&a[1..3]` の中身は？",
        snippet: `let a = [10, 20, 30, 40, 50];
let s = &a[1..3];
`,
        choices: ["[20, 30]", "[10, 20, 30]", "[20, 30, 40]", "[30, 40]"],
        answer: "[20, 30]",
        explain: "添字 1 以上 3 未満。a[1] = 20, a[2] = 30。",
      },
      {
        prompt: '文字列リテラル `"hello"` の型は？',
        choices: ["&str", "String", "&String", "[char; 5]"],
        answer: "&str",
        explain: "リテラルはバイナリに埋め込まれた文字列を指すスライス `&'static str`。",
      },
      {
        prompt: "このコードを実行するとどうなる？",
        snippet: `let s = String::from("日本");
let t = &s[0..2];
println!("{t}");
`,
        choices: [
          "panic する（文字の境界ではない）",
          "日 と表示される",
          "日本 と表示される",
          "コンパイルエラー",
        ],
        answer: "panic する（文字の境界ではない）",
        explain:
          '「日」は UTF-8 で 3 バイト。バイト位置 2 は文字の途中なので panic。`&s[0..3]` なら "日"。',
      },
      {
        prompt: "`fn total(v: &[i32]) -> i32` に **渡せない** ものは？",
        choices: [
          "vec![1, 2, 3]（参照を付けずに Vec をそのまま）",
          "&vec![1, 2, 3]",
          "&[1, 2, 3]",
          "&v[1..]（v は Vec<i32>）",
        ],
        answer: "vec![1, 2, 3]（参照を付けずに Vec をそのまま）",
        explain:
          "引数はスライス（参照）なので、所有権ごとの Vec は渡せない。&Vec<i32> や配列の参照は &[i32] に自動変換される。",
      },
      {
        prompt: "読むだけの文字列引数に `&String` より `&str` が好まれる理由は？",
        choices: [
          "&String も文字列リテラルも部分文字列も受け取れるから",
          "&str の方がメモリを多く使えるから",
          "&String では文字数を数えられないから",
          "&str なら中身を変更できるから",
        ],
        answer: "&String も文字列リテラルも部分文字列も受け取れるから",
        explain:
          "&String は &str に自動変換されるので、&str にしておけばより多くの呼び出し方に対応できる。",
      },
      {
        prompt: "このコードがコンパイルエラーになる理由は？",
        snippet: `let mut s = String::from("hello world");
let word = first_word(&s); // -> &str
s.clear();
println!("{word}");
`,
        choices: [
          "word が s を借用している間に s を変更しているから",
          "first_word が String を返していないから",
          "clear というメソッドはないから",
          "s が mut だから",
        ],
        answer: "word が s を借用している間に s を変更しているから",
        explain:
          "word は s の一部を指すスライス（不変借用）。それを使う前に clear（可変借用）しようとしたので E0502。",
      },
      {
        prompt: '`"héllo".len()` の値は？（é は 2 バイト）',
        choices: ["6", "5", "10", "4"],
        answer: "6",
        explain:
          "len() はバイト数。h, l, l, o が 1 バイトずつ、é が 2 バイトで計 6。文字数は chars().count() で 5。",
      },
    ],
  },
});
