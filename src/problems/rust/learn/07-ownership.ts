import { defineProblem } from "../../../core/schemas";

export default defineProblem({
  id: "rust-learn-ownership",
  stage: "learn",
  language: "rust",
  scenario: "rust",
  copy: {
    title: "所有権（move / Clone / Copy / drop）",
    prompt: `## なぜ所有権が必要なのか

プログラムが使うメモリは、使い終わったら解放しなければならない。言語ごとに解決方法が違う。

| 方式 | 例 | 問題点 |
|---|---|---|
| ガベージコレクタ（GC） | JS, Java, Go | 実行中に GC が動いて一時停止する・メモリを多めに使う |
| 手動で解放 | C, C++ | 解放忘れ（メモリリーク）、二重解放、解放後の使用でクラッシュ |
| **所有権** | Rust | コンパイル時のルールで、解放のタイミングを自動で決める |

Rust は **コンパイル時に** 「誰がいつ解放するか」を決めるので、実行時のコストがなく、解放ミスも起きない。その代わり、ルールを守らないコードはコンパイルが通らない。

## スタックとヒープ

| | スタック | ヒープ |
|---|---|---|
| しくみ | 皿を積むように上に置き、上から取る | 空いている場所を探して確保する |
| 速さ | 速い | 確保・アクセスともに比較的遅い |
| 置ける値 | **大きさがコンパイル時に決まる値**（\`i32\`, \`bool\`, \`char\`, \`[i32; 3]\` など） | 大きさが実行中に変わる値（\`String\` の中身、\`Vec\` の中身など） |
| 解放 | 関数を抜けると自動で消える | 誰かが解放しなければならない ← **所有権が管理する対象** |

\`String\` は、スタック上に「ポインタ・長さ・容量」の 3 つを持ち、文字のデータ本体はヒープに置いている。

\`\`\`text
スタック (s)               ヒープ
+----------+------+       +---+---+---+---+---+
| ptr      |  ─────────>  | h | e | l | l | o |
| len      |  5   |       +---+---+---+---+---+
| capacity |  5   |
+----------+------+
\`\`\`

## 所有権の 3 つのルール

- Rust の各値は、**所有者（owner）** と呼ばれる変数を持つ
- 所有者は **同時に 1 つだけ**
- 所有者が **スコープを抜けると、値は破棄（drop）される**

\`\`\`rust
fn main() {
    {
        let s = String::from("hello"); // s が所有者になる
        println!("{s}");
    } // ← ここで s がスコープを抜け、String のヒープメモリが自動で解放される
}
\`\`\`

この「スコープの終わりで自動的に解放する」処理を **drop** と呼ぶ。

## move（所有権の移動）

\`\`\`rust
let s1 = String::from("hello");
let s2 = s1;              // 所有権が s1 → s2 に移る（move）
println!("{s1}");         // NG: E0382 borrow of moved value: \`s1\`
\`\`\`

\`let s2 = s1;\` はヒープのデータをコピーしない。スタック上のポインタ・長さ・容量だけをコピーする。
もし s1 も s2 も有効なままだと、スコープを抜けたときに **同じヒープ領域を 2 回解放** してしまう（二重解放バグ）。
そこで Rust は、**代入した時点で s1 を無効にする**。これが move。

JS では \`let b = a;\` とすると同じオブジェクトを 2 つの変数が指すが、Rust では所有者は 1 人だけ。

## Clone（深いコピー）

ヒープのデータごと複製したいときは \`.clone()\` を呼ぶ。

\`\`\`rust
let s1 = String::from("hello");
let s2 = s1.clone();      // ヒープの中身も複製
println!("{s1} {s2}");    // OK: どちらも使える
\`\`\`

\`clone()\` はデータ量に比例して時間とメモリを使う。コードに \`clone()\` が見えたら「ここでコストがかかっている」という目印になる。
とりあえずエラーを消すために多用せず、後で学ぶ **借用（参照）** で済むならそちらを使う。

## Copy 型

整数などは代入しても元の変数が使える。

\`\`\`rust
let x = 5;
let y = x;            // コピーされる
println!("{x} {y}");  // OK
\`\`\`

スタックだけで完結する小さな値はコピーが安いので、move ではなく **自動でコピー** される。こうした型は **\`Copy\` トレイト** を実装している。

| Copy 型（代入でコピー） | Copy でない型（代入で move） |
|---|---|
| 整数（\`i32\`, \`u8\`, ...）、浮動小数（\`f64\`）、\`bool\`、\`char\` | \`String\`、\`Vec<T>\`、\`Box<T>\` |
| すべての要素が Copy のタプル \`(i32, bool)\` | \`String\` を含むタプル \`(i32, String)\` |
| 要素が Copy の配列 \`[i32; 3]\` | 要素が Copy でない配列 |
| 共有参照 \`&T\` | 可変参照 \`&mut T\` |

ヒープを持つ（drop で後片付けが必要な）型は Copy にできない。

## 関数に渡すと move する

関数の引数に渡すのも代入と同じ扱い。

\`\`\`rust
fn takes_ownership(s: String) {
    println!("{s}");
} // ← ここで s が drop され、メモリ解放

fn makes_copy(n: i32) {
    println!("{n}");
}

fn main() {
    let s = String::from("hello");
    takes_ownership(s);       // s の所有権が関数へ移動
    // println!("{s}");       // NG: E0382（s はもう無効）

    let x = 5;
    makes_copy(x);            // i32 は Copy なのでコピーが渡る
    println!("{x}");          // OK
}
\`\`\`

## 戻り値で所有権を返す

関数の戻り値として返すと、所有権が呼び出し元へ移る。

\`\`\`rust
fn gives_ownership() -> String {
    let s = String::from("yours");
    s                          // 所有権を呼び出し元へ move
}

fn takes_and_gives_back(s: String) -> String {
    s                          // 受け取ったものをそのまま返す
}

fn main() {
    let s1 = gives_ownership();
    let s2 = String::from("hello");
    let s3 = takes_and_gives_back(s2); // s2 は move され、s3 が新しい所有者
}
\`\`\`

値を使った後も呼び出し元で使い続けたいとき、「受け取って、タプルで一緒に返す」こともできる。

\`\`\`rust
fn calc_len(s: String) -> (String, usize) {
    let n = s.len();
    (s, n)
}
\`\`\`

ただし毎回これをやるのは面倒なので、Rust には **参照（借用）** という仕組みがある（次の章）。

## drop のタイミング

- 変数は **宣言の逆順** にスコープの終わりで drop される
- move された変数は、もう所有していないので何もしない（二重解放にならない）
- 変数に新しい値を代入すると、**古い値はその場で drop** される
- 早く解放したいときは \`drop(値)\` 関数を呼ぶ（それ以降その変数は使えない）

\`\`\`rust
let mut s = String::from("first");
s = String::from("second"); // "first" はここで drop される
let big = vec![0u8; 1_000_000];
drop(big);                  // ここで明示的に解放
// big はもう使えない
\`\`\`

## 引数で受け取った値を書き換えたい

move で受け取った値は自分のものなので、\`mut\` を付ければ自由に変更できる。

\`\`\`rust
fn shout(mut s: String) -> String {
    s.push('!');
    s
}
\`\`\`

## まとめ

- 値の所有者は 1 人。所有者がスコープを抜けると drop
- \`String\` などの代入・関数呼び出しは **move**。元の変数は使えなくなる
- 複製したいなら \`.clone()\`（コストがかかる）
- 整数・bool・char などの \`Copy\` 型は自動でコピーされる
- 戻り値で所有権を呼び出し元に返せる`,
    hints: [
      "値の所有者は常に 1 つ。所有者がスコープを抜けると drop される。",
      "String などは代入や関数呼び出しで move する。元の変数は使えなくなる（E0382）。",
      "複製したいなら .clone()。整数などの Copy 型は自動でコピーされる。",
      "戻り値として返せば所有権を呼び出し元に渡せる。",
    ],
  },
  learn: {
    quiz: [
      {
        prompt: "このコードをコンパイルするとどうなる？",
        snippet: `let s1 = String::from("hi");
let s2 = s1;
println!("{s1}");
`,
        choices: [
          "E0382 エラー（move 後の値を使っている）",
          "hi と表示される",
          "空文字が表示される",
          "実行時に panic する",
        ],
        answer: "E0382 エラー（move 後の値を使っている）",
        explain:
          "`let s2 = s1;` で所有権が s2 に移り、s1 は無効になる。`s1.clone()` にするか参照を使う。",
      },
      {
        prompt: "このコードをコンパイルするとどうなる？",
        snippet: `let a = 10;
let b = a;
println!("{a} {b}");
`,
        choices: [
          "10 10 と表示される",
          "E0382 エラー",
          "10 と () が表示される",
          "実行時に panic する",
        ],
        answer: "10 10 と表示される",
        explain: "i32 は Copy 型なので、代入すると値がコピーされ、a もそのまま使える。",
      },
      {
        prompt: "Copy **ではない** 型は？",
        choices: ["String", "u64", "(i32, char)", "[bool; 4]"],
        answer: "String",
        explain:
          "String はヒープにデータを持ち、drop で解放が必要なので Copy にできない。代入すると move する。",
      },
      {
        prompt: "所有権のルールとして **正しくない** ものは？",
        choices: [
          "1 つの値に所有者が複数いてもよい",
          "各値には所有者となる変数がある",
          "所有者がスコープを抜けると値は破棄される",
          "所有権は代入や関数呼び出しで移動することがある",
        ],
        answer: "1 つの値に所有者が複数いてもよい",
        explain: "所有者は同時に 1 つだけ。だから二重解放が起きない。",
      },
      {
        prompt: "`takes(s)` の後で `s` を使うとエラーになった。最も簡単な直し方の 1 つは？",
        snippet: `fn takes(s: String) -> usize { s.len() }

let s = String::from("abc");
let n = takes(s);
println!("{s} {n}");
`,
        choices: [
          "`takes(s.clone())` と複製を渡す",
          "`let mut s` にする",
          "関数はそのままで、呼び出しだけ `takes(&s)` にする",
          "`s` を `const` にする",
        ],
        answer: "`takes(s.clone())` と複製を渡す",
        explain:
          "複製を渡せば s の所有権は残る。呼び出しだけ `&s` にしても、関数が String を要求しているので型エラーになる。より良いのは、次の章で学ぶ参照 `&String` / `&str` を受け取るように変えること。",
      },
      {
        prompt: "`String` の中身（文字データ）が置かれる場所は？",
        choices: ["ヒープ", "スタック", "実行ファイルの中", "CPU のレジスタ"],
        answer: "ヒープ",
        explain:
          "String は伸び縮みするので文字データはヒープに置き、スタックにはポインタ・長さ・容量を持つ。",
      },
      {
        prompt: 'このコードで "first" の String が drop されるのはいつ？',
        snippet: `fn main() {
    let mut s = String::from("first");
    s = String::from("second");
    println!("{s}");
}
`,
        choices: [
          "2 行目で s に新しい値が代入されたとき",
          "main の終わり",
          "println! の直後",
          "drop されない（メモリリーク）",
        ],
        answer: "2 行目で s に新しい値が代入されたとき",
        explain:
          '変数に新しい値を代入すると、それまで持っていた値はその場で drop される。"second" は main の終わりで drop。',
      },
    ],
  },
});
