import { defineProblem } from "../../../core/schemas";

export default defineProblem({
  id: "rust-learn-references-borrowing",
  stage: "learn",
  language: "rust",
  scenario: "rust",
  copy: {
    title: "参照と借用（&T / &mut T / 借用ルール）",
    prompt: `## 参照とは

前の章では、\`String\` を関数に渡すと所有権が移ってしまい、使い続けるには返してもらう必要があった。
**参照（reference）** を使えば、所有権を移さずに値を「貸す」ことができる。

\`\`\`rust
fn calculate_length(s: &String) -> usize {
    s.len()
} // s は参照なので、ここで drop されるのは「参照」だけ。String 本体は解放されない

fn main() {
    let s1 = String::from("hello");
    let len = calculate_length(&s1);   // &s1 で参照を作って渡す
    println!("{s1} の長さは {len}");    // OK: s1 はまだ使える
}
\`\`\`

- \`&s1\` … s1 への参照を作る（**借用する**、と言う）
- \`&String\` … 「String への参照」という型
- 参照は所有権を持たないので、参照がスコープを抜けても元の値は drop されない

\`\`\`text
s (参照)          s1 (String)              ヒープ
+-----+          +----------+-----+       +---+---+---+---+---+
| ptr | ──────>  | ptr      |  ─────────> | h | e | l | l | o |
+-----+          | len      |  5  |       +---+---+---+---+---+
                 | capacity |  5  |
                 +----------+-----+
\`\`\`

参照を作ることを **借用（borrowing）** と呼ぶ。現実の貸し借りと同じで、借りたものは返す必要があり、持ち主より長く持ち続けることはできない。

## 不変参照 \`&T\`

\`&T\` で借りた値は **読むだけ** で、変更はできない。

\`\`\`rust
fn change(s: &String) {
    s.push_str(", world"); // NG: E0596 cannot borrow \`*s\` as mutable
}
\`\`\`

## 可変参照 \`&mut T\`

変更したいときは **可変参照** を使う。元の変数も \`mut\` である必要がある。

\`\`\`rust
fn change(s: &mut String) {
    s.push_str(", world");
}

fn main() {
    let mut s = String::from("hello");  // 元の変数を mut に
    change(&mut s);                     // &mut で可変参照を渡す
    println!("{s}");                    // hello, world
}
\`\`\`

3 か所に \`mut\` が必要なことに注意: **変数宣言 \`let mut\`**、**引数の型 \`&mut String\`**、**呼び出し \`&mut s\`**。

## 参照外し \`*\`

参照が指す先の値そのものを扱うときは \`*\` を付ける（**参照外し / dereference**）。

\`\`\`rust
fn add_one(n: &mut i32) {
    *n += 1;          // n は参照。*n で「指している先の i32」
}

fn main() {
    let mut x = 5;
    add_one(&mut x);
    println!("{x}");  // 6

    let r = &x;
    let y = *r + 10;  // 参照から値を読み出す
    println!("{y}");  // 16
}
\`\`\`

メソッド呼び出し（\`s.len()\`、\`s.push_str()\`）や \`println!\` では、Rust が自動で参照外しをしてくれるので \`*\` を書かなくてよい。
比較 \`==\` も参照同士なら中身を比べてくれる。数値の演算や代入では \`*\` が必要になることが多い。

## 借用のルール（最重要）

どの時点でも、次の **どちらか一方** しか成り立たない。

- **不変参照 \`&T\` がいくつでも**
- **可変参照 \`&mut T\` がただ 1 つだけ**

そして、参照は常に **有効な値を指していなければならない**。

### 可変参照は同時に 1 つ

\`\`\`rust
let mut s = String::from("hello");
let r1 = &mut s;
let r2 = &mut s;          // NG: E0499 2 つ目の可変借用
println!("{r1} {r2}");
\`\`\`

### 不変参照と可変参照は同時に持てない

\`\`\`rust
let mut s = String::from("hello");
let r1 = &s;
let r2 = &s;              // OK: 不変参照はいくつでも
let r3 = &mut s;          // NG: E0502 不変借用中に可変借用
println!("{r1} {r2} {r3}");
\`\`\`

### なぜこんなルールがあるのか

**データ競合（data race）** をコンパイル時に防ぐため。データ競合は次の 3 つがそろうと起きる。

- 2 つ以上のポインタが同じデータに同時にアクセスする
- 少なくとも 1 つが書き込む
- アクセスの同期がとれていない

読んでいる最中に誰かが書き換えると、読み手は壊れたデータを見るかもしれない。
たとえば \`Vec\` に要素を追加するとメモリが再確保されて場所が移ることがあり、古い場所を指す参照は **解放済みのメモリ** を指してしまう。Rust はこれをコンパイル時に禁止する。

\`\`\`rust
let mut v = vec![1, 2, 3];
let first = &v[0];
v.push(4);                 // NG: E0502 first が借用中なのに変更
println!("{first}");
\`\`\`

## NLL（Non-Lexical Lifetimes）

参照の有効範囲は「スコープの終わり」までではなく、**最後に使われた場所** までとみなされる。

\`\`\`rust
let mut s = String::from("hello");
let r1 = &s;
let r2 = &s;
println!("{r1} {r2}");    // r1, r2 はここで最後に使われる → 借用終了

let r3 = &mut s;          // OK: もう不変参照は使われていない
r3.push('!');
println!("{r3}");
\`\`\`

借用エラーが出たら、「参照を使い終わってから変更する」ように **順番を入れ替える** だけで直ることが多い。
ブロック \`{ }\` で参照の範囲を区切るのも手。

## ダングリング参照の防止

**ダングリング参照**: すでに解放されたメモリを指す参照。C/C++ でよくあるバグ。
Rust では、参照が値より長生きするコードはコンパイルエラーになる。

\`\`\`rust
fn dangle() -> &String {     // NG: E0106 missing lifetime specifier
    let s = String::from("hello");
    &s                       // s は関数の終わりで drop されるのに、その参照を返そうとしている
}
\`\`\`

直し方: 参照ではなく **値（所有権）そのものを返す**。

\`\`\`rust
fn no_dangle() -> String {
    let s = String::from("hello");
    s                        // 所有権ごと呼び出し元へ move するので安全
}
\`\`\`

関数の中で作った値への参照は返せない、と覚えておこう（引数で受け取った参照から作った参照なら返せる。ライフタイムの章で詳しく）。

## どれを使えばいいか

| 引数の型 | 意味 | 呼び出し後に元の変数 |
|---|---|---|
| \`T\`（例: \`String\`） | 所有権をもらう。関数が値を消費・保存する | 使えない（Copy 型以外） |
| \`&T\`（例: \`&String\`, \`&str\`） | 読むだけ借りる | そのまま使える |
| \`&mut T\`（例: \`&mut String\`） | 書き換えるために借りる | 変更された状態で使える |

**まず \`&T\` を考え、変更が必要なら \`&mut T\`、所有権が本当に必要なときだけ \`T\`** にするのが基本方針。`,
    hints: [
      "`&x` で不変参照（読むだけ）、`&mut x` で可変参照（書き換え可）。",
      "同時に持てるのは「不変参照いくつでも」か「可変参照 1 つだけ」のどちらか。",
      "参照の先の値を扱うには `*r`（参照外し）。メソッド呼び出しでは自動。",
      "関数内で作った値の参照は返せない。値そのものを返す。",
    ],
  },
  learn: {
    quiz: [
      {
        prompt: "このコードの結果は？",
        snippet: `fn len_of(s: &String) -> usize { s.len() }

fn main() {
    let s = String::from("hey");
    let n = len_of(&s);
    println!("{s} {n}");
}
`,
        choices: ["hey 3 と表示される", "E0382 エラー", "E0502 エラー", "3 だけ表示される"],
        answer: "hey 3 と表示される",
        explain: "参照を渡しているので所有権は移らない。s は呼び出し後も使える。",
      },
      {
        prompt: "`x` の最終的な値は？",
        snippet: `fn triple(n: &mut i32) {
    *n *= 3;
}

let mut x = 4;
triple(&mut x);
triple(&mut x);
`,
        choices: ["36", "12", "4", "コンパイルエラー"],
        answer: "36",
        explain: "`*n *= 3` で参照先の値を 3 倍する。4 → 12 → 36。",
      },
      {
        prompt: "コンパイルエラーになるのはどれ？",
        choices: [
          'let r1 = &mut s; let r2 = &mut s; println!("{r1}{r2}");',
          'let r1 = &s; let r2 = &s; println!("{r1}{r2}");',
          "let r1 = &s; println!(\"{r1}\"); let r2 = &mut s; r2.push('a');",
          "let r1 = &mut s; r1.push('a'); let r2 = &mut s; r2.push('b');",
        ],
        answer: 'let r1 = &mut s; let r2 = &mut s; println!("{r1}{r2}");',
        explain:
          "r1 と r2 の可変参照が同時に生きている（両方が println! で使われる）ので E0499。他は NLL により借用期間が重ならない。",
      },
      {
        prompt: "Rust の借用ルールが主に防いでいるものは？",
        choices: [
          "データ競合と解放済みメモリの参照",
          "整数のオーバーフロー",
          "無限ループ",
          "型の不一致",
        ],
        answer: "データ競合と解放済みメモリの参照",
        explain:
          "読み手がいる間の書き換えを禁止することで、データ競合やダングリング参照をコンパイル時に防ぐ。",
      },
      {
        prompt: "このコードがエラーになる理由は？",
        snippet: `let mut v = vec![1, 2, 3];
let first = &v[0];
v.push(4);
println!("{first}");
`,
        choices: [
          "first（不変借用）が使われる前に v を変更（可変借用）しているから",
          "vec! の要素数が足りないから",
          "first に型注釈がないから",
          "v が mut でないから",
        ],
        answer: "first（不変借用）が使われる前に v を変更（可変借用）しているから",
        explain:
          "push でメモリが再確保されると first が解放済みの場所を指してしまう。println! を push の前に移すか、`let first = v[0];` でコピーすれば直る。",
      },
      {
        prompt: "このコードがエラーになる理由と直し方は？",
        snippet: `fn make() -> &String {
    let s = String::from("hi");
    &s
}
`,
        choices: [
          "s は関数の終わりで drop されるので参照を返せない。String を返す",
          "&s ではなく *s と書く必要がある",
          "s を mut にすれば直る",
          "String::from ではなく String::new を使う",
        ],
        answer: "s は関数の終わりで drop されるので参照を返せない。String を返す",
        explain:
          "ダングリング参照になるのでコンパイルエラー（E0106）。戻り値を `String` にして `s` を返せば所有権ごと渡せる。",
      },
      {
        prompt: "`&mut` で借用するために必要なものは？",
        snippet: `fn add(s: &mut String) { s.push('!'); }

let s = String::from("a");
add(&mut s);
`,
        choices: [
          "元の変数を `let mut s` で宣言すること",
          "add の中で `*s.push('!')` と書くこと",
          "`add(&s)` と呼ぶこと",
          "何も必要ない（このままで動く）",
        ],
        answer: "元の変数を `let mut s` で宣言すること",
        explain: "不変の変数から可変参照は作れない（E0596）。`let mut s` にする。",
      },
    ],
  },
});
