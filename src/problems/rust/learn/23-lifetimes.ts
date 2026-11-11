import { defineProblem } from "../../../core/schemas";

export default defineProblem({
  id: "rust-learn-lifetimes",
  stage: "learn",
  language: "rust",
  scenario: "rust",
  copy: {
    title: "ライフタイム（参照の有効期間）",
    prompt: `## ライフタイムとは

**ライフタイム（lifetime）** は「その参照が有効でいられる期間（スコープ）」のこと。
Rust のコンパイラ（借用チェッカー）は、**参照が、参照先の値より長生きしない** ことをコンパイル時に確かめている。これで「解放済みのメモリを指す参照（ダングリング参照）」が絶対に生まれない。

\`\`\`rust
fn main() {
    let r;
    {
        let x = 5;
        r = &x;        // error[E0597]: \`x\` does not live long enough
    }                  // ← x はここで破棄される
    println!("{}", r); // r は破棄済みの x を指してしまう
}
\`\`\`

\`x\` のライフタイムが \`r\` より短いので、コンパイラが止めてくれる。C/C++ ならこのまま動いて、運が悪ければ壊れる。JS は GC があるので \`x\` が生き延びるが、Rust には GC がない。

ふだんはライフタイムを **推論** してくれるので意識しなくてよい。書く必要があるのは、**コンパイラが推論できないとき** だけ。

## なぜ注釈が必要になるのか

2 つの文字列スライスのうち長いほうを返す関数を考える。

\`\`\`rust
fn longest(x: &str, y: &str) -> &str {   // error[E0106]: missing lifetime specifier
    if x.len() > y.len() { x } else { y }
}
\`\`\`

戻り値は x か y のどちらかを指すが、**どちらかは実行するまで分からない**。だからコンパイラは「戻り値の参照がいつまで有効か」を決められない。そこで、人間が関係を教える。

## 'a 注釈の書き方

\`\`\`rust
fn longest<'a>(x: &'a str, y: &'a str) -> &'a str {
    if x.len() > y.len() { x } else { y }
}
\`\`\`

- \`'a\` は **ライフタイム引数**。\`'\` + 小文字の名前（\`'a\`, \`'b\`, \`'input\` など）
- ジェネリクスと同じく \`<'a>\` で宣言してから使う
- \`&'a str\` … 「ライフタイム \`'a\` の間有効な \`&str\`」
- 意味: 「**戻り値は、x と y の両方が有効な間（短いほうの期間）だけ有効**」

**ライフタイム注釈は寿命を延ばしたり変えたりしない**。「参照同士の関係」をコンパイラに説明するだけ。

\`\`\`rust
fn main() {
    let a = String::from("long string");
    let result;
    {
        let b = String::from("xyz");
        result = longest(a.as_str(), b.as_str());
        println!("{}", result); // OK: b がまだ生きている
    }
    // println!("{}", result); // error[E0597]: b が先に破棄されるので使えない
}
\`\`\`

### 戻り値と関係ない引数には付けなくてよい

\`\`\`rust
fn first<'a>(x: &'a str, y: &str) -> &'a str {
    x      // 戻り値は常に x を指すので、y にライフタイムの関係は不要
}
\`\`\`

別々のライフタイムを付けることもできる: \`fn f<'a, 'b>(x: &'a str, y: &'b str) -> &'a str\`。こうすると「戻り値は x にだけ依存する」ことがはっきりし、y が先に破棄されても戻り値を使い続けられる。

## ライフタイムの省略規則（3 つ）

\`fn first_word(s: &str) -> &str\` は注釈なしで書けた。これはコンパイラが次の **省略規則（elision rules）** で自動的にライフタイムを補うから。

| 規則 | 内容 |
|---|---|
| 1 | 参照の引数には、**それぞれ別の** ライフタイムが付く |
| 2 | 参照の引数が **ちょうど 1 つ** なら、戻り値の参照にもそのライフタイムが付く |
| 3 | メソッドで \`&self\` / \`&mut self\` があれば、戻り値の参照には **self のライフタイム** が付く |

これで決まらなければ \`error[E0106]\` になり、自分で書く必要がある。

\`\`\`rust
fn first_word(s: &str) -> &str
// 規則1: fn first_word<'a>(s: &'a str) -> &str
// 規則2: fn first_word<'a>(s: &'a str) -> &'a str   ← 決まった！

fn longest(x: &str, y: &str) -> &str
// 規則1: fn longest<'a, 'b>(x: &'a str, y: &'b str) -> &str
// 規則2: 引数が 2 つなので適用できない
// 規則3: メソッドではない → 戻り値が決まらない → E0106

impl Doc {
    fn title(&self, prefix: &str) -> &str  // 規則3 で self のライフタイムになる
}
\`\`\`

注意: \`&[&str]\` は参照が **2 つ**（スライス自体と、中の \`&str\`）含まれるので規則 2 が使えない。

## 構造体に参照を持たせる

構造体のフィールドに参照を持たせるときは **必ず** ライフタイム注釈が要る。

\`\`\`rust
struct Excerpt<'a> {
    part: &'a str,
}

fn main() {
    let novel = String::from("Call me Ishmael. Some years ago...");
    let first = novel.split('.').next().unwrap();
    let e = Excerpt { part: first };   // e は novel より長生きできない
    println!("{}", e.part);
}
\`\`\`

意味: 「\`Excerpt\` のインスタンスは、\`part\` が指す文字列より長生きできない」。

impl でも宣言が必要（ジェネリクスと同じ形）。

\`\`\`rust
impl<'a> Excerpt<'a> {
    fn part(&self) -> &str {          // 規則3 で self のライフタイム
        self.part
    }
    fn original(&self) -> &'a str {   // 元の文字列のライフタイムで返すこともできる
        self.part
    }
}
\`\`\`

\`&'a str\` で返すと、Excerpt 自体を捨てた後も戻り値を使い続けられる（元の文字列が生きていれば）。パーサやトークナイザのように「入力を切り出して返す」型で便利。

参照ではなく \`String\` を持たせれば、ライフタイムは要らない。**初心者のうちは「迷ったら所有する型（String, Vec）を持たせる」でよい**。

## 'static

\`'static\` は **プログラムの実行中ずっと有効** という特別なライフタイム。

\`\`\`rust
let s: &'static str = "hello";  // 文字列リテラルはバイナリに埋め込まれるので 'static

fn level_name(n: u8) -> &'static str {
    match n {
        0 => "low",
        1 => "mid",
        _ => "high",
    }
}
\`\`\`

- 文字列リテラルはすべて \`&'static str\`
- \`static\` / \`const\` で定義した値への参照も \`'static\`
- エラーメッセージで「\`'static\` を付けろ」と提案されても、安易に付けるのは避ける。本当に必要なのはたいてい「所有する値を返す」こと

## よくあるエラー

### E0106: ライフタイム指定が足りない

\`\`\`rust
fn pick(a: &str, b: &str) -> &str { a }      // E0106
fn pick<'a>(a: &'a str, b: &str) -> &'a str { a } // 直し方

struct S { name: &str }                       // E0106
struct S<'a> { name: &'a str }                // 直し方
\`\`\`

### E0597: 借用している値が長生きしない

\`\`\`rust
let r;
{
    let s = String::from("hi");
    r = &s;      // E0597
}
println!("{}", r);
\`\`\`

直し方: 値のスコープを広げる（\`s\` を外に出す）、または参照ではなく値を移す（\`r = s;\`）。

### E0515: 関数内で作った値への参照を返している

\`\`\`rust
fn make() -> &str {           // （注釈を付けても）
    let s = String::from("hi");
    &s                        // E0515: s は関数の終わりで破棄される
}
\`\`\`

直し方: **参照ではなく所有する値を返す**。

\`\`\`rust
fn make() -> String {
    String::from("hi")
}
\`\`\`

関数内で作った値は関数の終わりで破棄されるので、それを指す参照はどんな注釈を付けても返せない。

## まとめ

- ライフタイム = 参照が有効な期間。参照が参照先より長生きしないことをコンパイラが保証する
- 普段は推論・省略規則に任せる。複数の参照引数から参照を返すとき、構造体に参照を持たせるときに \`'a\` を書く
- 注釈は寿命を変えない。関係を説明するだけ
- 省略規則: 各引数に別々 → 引数 1 つならそれ → \`&self\` があれば self
- 関数内で作った値の参照は返せない（E0515）→ 所有する値を返す`,
    hints: [
      "ライフタイム注釈は寿命を変えず、参照同士の関係をコンパイラに教えるだけ。",
      "省略規則で決まらないとき（参照引数が複数で参照を返すなど）に `'a` を書く。",
      "構造体に参照を持たせるなら `struct S<'a> { r: &'a str }`。",
      "関数内で作った値への参照は返せない。所有する値（String など）を返す。",
    ],
  },
  learn: {
    quiz: [
      {
        prompt: "次の関数がコンパイルエラー（E0106）になる理由は？",
        snippet: `fn longest(x: &str, y: &str) -> &str {
    if x.len() > y.len() { x } else { y }
}
`,
        choices: [
          "戻り値の参照が x と y のどちらのライフタイムに従うか決められないから",
          "&str は返せないから",
          "if 式が値を返せないから",
          "len() が使えないから",
        ],
        answer: "戻り値の参照が x と y のどちらのライフタイムに従うか決められないから",
        explain:
          "参照引数が 2 つあるので省略規則 2 が使えない。`<'a>` を付けて x, y, 戻り値を同じ 'a で結ぶ。",
      },
      {
        prompt: "ライフタイム注釈 `'a` を付ける効果として正しいのは？",
        choices: [
          "参照同士の有効期間の関係をコンパイラに伝える",
          "値の寿命を延ばす",
          "値をヒープに移す",
          "参照を実行時にチェックする",
        ],
        answer: "参照同士の有効期間の関係をコンパイラに伝える",
        explain:
          "注釈は寿命を変えない。関係を説明して、借用チェッカーが安全性を確かめられるようにするだけ。",
      },
      {
        prompt: "省略規則で、注釈なしでもコンパイルできるのは？",
        choices: [
          "fn f(s: &str) -> &str",
          "fn f(a: &str, b: &str) -> &str",
          "fn f() -> &str",
          "struct S { r: &str }",
        ],
        answer: "fn f(s: &str) -> &str",
        explain:
          "参照引数が 1 つなら戻り値にそのライフタイムが付く（規則 2）。構造体のフィールドの参照は常に注釈が要る。",
      },
      {
        prompt: "メソッド `fn name(&self, other: &str) -> &str` の戻り値のライフタイムは？",
        choices: ["self と同じ（規則 3）", "other と同じ", "'static", "決まらずエラー"],
        answer: "self と同じ（規則 3）",
        explain: "&self があるメソッドでは、戻り値の参照に self のライフタイムが付く。",
      },
      {
        prompt: "次のコードのエラーと直し方の組み合わせで正しいのは？",
        snippet: `fn make_name() -> &'static str {
    let s = String::from("Ferris");
    &s
}
`,
        choices: [
          "E0515。戻り値を String にして s をそのまま返す",
          "E0106。<'a> を付ける",
          "E0382。clone() する",
          "エラーにならない",
        ],
        answer: "E0515。戻り値を String にして s をそのまま返す",
        explain:
          "s は関数の終わりで破棄されるので、その参照はどんな注釈でも返せない。所有権ごと返す。",
      },
      {
        prompt: "`&'static str` になるものは？",
        choices: [
          '"hello"（文字列リテラル）',
          'String::from("hello").as_str()',
          'format!("hi")',
          "関数の引数 s: &str",
        ],
        answer: '"hello"（文字列リテラル）',
        explain: "文字列リテラルはプログラムのバイナリに埋め込まれていて、実行中ずっと有効。",
      },
      {
        prompt: "`struct Parser<'a> { input: &'a str }` の意味は？",
        choices: [
          "Parser は input が指す文字列より長生きできない",
          "input は 'static でなければならない",
          "Parser は input をコピーして持つ",
          "Parser は 'a 秒間だけ有効",
        ],
        answer: "Parser は input が指す文字列より長生きできない",
        explain:
          "構造体が参照を持つとき、その構造体は参照先より長く生きられない。それを 'a で表している。",
      },
    ],
  },
});
