import { defineProblem } from "../../../core/schemas";

export default defineProblem({
  id: "rust-learn-format-output",
  stage: "learn",
  language: "rust",
  scenario: "rust",
  copy: {
    title: "フォーマットと出力（println! / format! / Display）",
    prompt: `## 出力の 5 つのマクロ

Rust の文字列出力は、すべて **書式文字列（format string）** を使うマクロで行う。書式はコンパイル時にチェックされるので、\`{}\` の数と引数の数が合わないと **コンパイルエラー** になる（JS のテンプレートリテラルや C の printf と違い、実行時に壊れない）。

| マクロ | 出力先 | 改行 | 戻り値 |
|---|---|---|---|
| \`println!\` | 標準出力 | あり | \`()\` |
| \`print!\` | 標準出力 | なし | \`()\` |
| \`eprintln!\` | 標準エラー | あり | \`()\` |
| \`eprint!\` | 標準エラー | なし | \`()\` |
| \`format!\` | （出力しない） | - | \`String\` |
| \`write!\` / \`writeln!\` | 指定した書き込み先 | \`writeln!\` はあり | \`fmt::Result\` など |

\`\`\`rust
fn main() {
    let name = "Ferris";
    println!("こんにちは、{}さん", name);   // こんにちは、Ferrisさん
    print!("改行なし ");
    print!("のまま続く\\n");
    eprintln!("これはエラー出力（標準エラー）に出る");
    let s: String = format!("{}は{}歳", name, 7); // 文字列を作るだけ
    println!("{s}");
}
\`\`\`

- **\`eprintln!\`** はエラーメッセージ用。\`cargo run > out.txt\` でリダイレクトしても画面に残る
- **\`format!\`** は表示せずに \`String\` を返す。JS の \`\` \`\${a}は\${b}歳\` \`\` に相当
- マクロなので **可変個の引数** を取れる（Rust の普通の関数は可変長引数を持てない）

## {} と {:?} と {:#?}

| 書き方 | 使うトレイト | 用途 |
|---|---|---|
| \`{}\` | \`Display\` | 人間向けの表示。自作型は自分で実装する |
| \`{:?}\` | \`Debug\` | 開発者向けの表示。\`#[derive(Debug)]\` で自動生成できる |
| \`{:#?}\` | \`Debug\`（整形） | 複数行にインデントして見やすく表示 |

\`\`\`rust
#[derive(Debug)]
struct Point { x: i32, y: i32 }

fn main() {
    let v = vec![1, 2, 3];
    let p = Point { x: 1, y: 2 };
    let s = "hi";
    println!("{:?}", v);   // [1, 2, 3]
    println!("{:?}", p);   // Point { x: 1, y: 2 }
    println!("{}", s);     // hi
    println!("{:?}", s);   // "hi"   ← Debug は引用符付き
    println!("{:#?}", p);
    // Point {
    //     x: 1,
    //     y: 2,
    // }
}
\`\`\`

- \`Vec\` や \`Option\` は \`Display\` を実装していないので \`println!("{}", v)\` は **E0277** のコンパイルエラー。「どう見せるのが正解か」が型ごとに決まらないから、Rust はあえて実装していない
- 文字列の Debug 表示は \`"hi"\` のように **引用符とエスケープ付き**。\`'a'\` も Debug だと \`'a'\`

## 引数の指定方法

\`\`\`rust
let a = 10;
let b = 20;
println!("{} + {} = {}", a, b, a + b);   // 順番通り
println!("{0} と {1}、もう一度 {0}", a, b); // 位置指定: 10 と 20、もう一度 10
println!("{x} は {y} より小さい", x = a, y = b); // 名前付き引数
println!("{a} + {b} = {}", a + b);       // インライン変数（Rust 2021 以降）
\`\`\`

- **インライン変数 \`{a}\`** はスコープにある **変数名だけ** を書ける。\`{a + b}\` や \`{p.x}\` のような式は書けない（その場合は引数で渡す）
- 中括弧そのものを出したいときは **\`{{\` と \`}}\`**: \`println!("{{}}")\` → \`{}\`

## 幅・寄せ・埋め文字

書式は \`{\` 引数 \`:\` 埋め文字 寄せ 幅 \`.\` 精度 型 \`}\` の順に指定する。

| 書式 | 結果（値 \`42\`） | 意味 |
|---|---|---|
| \`{:5}\` | \`   42\` | 幅 5（数値はデフォルト右寄せ） |
| \`{:<5}\` | \`42   \` | 左寄せ |
| \`{:>5}\` | \`   42\` | 右寄せ |
| \`{:^5}\` | \` 42  \` | 中央寄せ（余りは右へ） |
| \`{:05}\` | \`00042\` | ゼロ埋め |
| \`{:*^7}\` | \`**42***\` | \`*\` で埋めて中央寄せ |
| \`{:+}\` | \`+42\` | 符号を常に表示 |

\`\`\`rust
let items = [("apple", 120), ("banana", 80), ("melon", 1500)];
for (name, price) in items {
    println!("{:<8}|{:>6}円", name, price);
}
// apple   |   120円
// banana  |    80円
// melon   |  1500円
\`\`\`

- **文字列はデフォルト左寄せ、数値はデフォルト右寄せ**
- 幅を変数で渡す: \`{:>width$}\` や \`{:>1$}\`（1 番目の引数を幅に使う）。例: \`println!("{:>w$}", 42, w = 6);\`
- 幅は「最低幅」。中身のほうが長ければはみ出して表示される（切り詰めない）

## 精度（小数点以下の桁）

\`\`\`rust
let pi = 3.14159265;
println!("{:.2}", pi);    // 3.14（四捨五入）
println!("{:8.3}", pi);   // "   3.142"（幅 8、小数 3 桁）
println!("{:08.2}", -pi); // "-0003.14"
println!("{:.0}", 2.5_f64); // 2（偶数丸め）
let s = "abcdef";
println!("{:.3}", s);     // abc（文字列では「最大文字数」の意味）
\`\`\`

## 16 進・2 進・8 進・指数

| 書式 | 値 255 の結果 |
|---|---|
| \`{:x}\` | \`ff\` |
| \`{:X}\` | \`FF\` |
| \`{:#x}\` | \`0xff\` |
| \`{:b}\` | \`11111111\` |
| \`{:#b}\` | \`0b11111111\` |
| \`{:o}\` | \`377\` |
| \`{:08b}\`（値 5） | \`00000101\` |
| \`{:e}\`（値 1234.5） | \`1.2345e3\` |

\`#\` は「接頭辞を付ける」、\`#\` と \`0\` を組み合わせた \`{:#010b}\` は接頭辞込みで幅 10 のゼロ埋めになる。

## Display を自分で実装する

自作の型を \`{}\` で表示したいときは \`std::fmt::Display\` を実装する。

\`\`\`rust
use std::fmt;

struct Point { x: i32, y: i32 }

impl fmt::Display for Point {
    fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
        write!(f, "({}, {})", self.x, self.y)
    }
}

fn main() {
    let p = Point { x: 3, y: -1 };
    println!("{}", p);            // (3, -1)
    let s = p.to_string();        // Display を実装すると to_string() も使える
    println!("[{s}]");            // [(3, -1)]
}
\`\`\`

- \`fmt\` は \`Formatter\` に書き込み、成功したかを \`fmt::Result\` で返す
- 中では **\`write!(f, ...)\`** を使う。\`?\` で途中のエラーを返せる
- \`Display\` を実装すると **\`ToString\` が自動で付いてくる**（\`to_string()\` が使える）
- \`{:>10}\` のような幅指定を自作型でも効かせたいときは \`f.pad(&文字列)\` を使う（\`write!\` は幅を無視する）

## Debug を手で実装する

ほとんどは \`#[derive(Debug)]\` で十分だが、パスワードを隠すなど表示を変えたいときは手で書く。

\`\`\`rust
use std::fmt;

struct User { name: String, password: String }

impl fmt::Debug for User {
    fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
        f.debug_struct("User")
            .field("name", &self.name)
            .field("password", &"****")
            .finish()
    }
}
// println!("{:?}", u) → User { name: "alice", password: "****" }
\`\`\`

\`debug_struct\` / \`debug_list\` / \`debug_tuple\` を使うと \`{:#?}\` の整形表示にも自動で対応する。

## write! で String やファイルに書く

\`write!\` は「書き込み先」を第 1 引数に取る。\`String\` に書くには \`std::fmt::Write\` を \`use\` する。

\`\`\`rust
use std::fmt::Write;

fn main() {
    let mut out = String::new();
    for i in 1..=3 {
        writeln!(out, "{i} 行目").unwrap();
    }
    write!(out, "おわり").unwrap();
    print!("{out}");
}
\`\`\`

- \`String\` への書き込みは失敗しないが、\`write!\` は \`Result\` を返すので \`.unwrap()\` か \`?\` で受ける（無視すると「unused Result」の警告）
- ファイルや標準出力への書き込みは \`std::io::Write\`（こちらは本当に失敗しうる）。2 つの \`Write\` は別物
- 大量の \`format!\` + \`push_str\` より、\`write!\` で直接 1 つの \`String\` に書くほうが無駄な一時文字列を作らない

## まとめ

- 出力は \`println!\` 系、文字列を作るのは \`format!\`、書き込み先を選ぶのは \`write!\`
- \`{}\` は Display（人間向け）、\`{:?}\` は Debug（開発者向け）、\`{:#?}\` は整形 Debug
- 書式指定は \`{:埋め寄せ幅.精度型}\`。\`<\` \`>\` \`^\` で寄せ、\`0\` でゼロ埋め、\`.2\` で小数 2 桁、\`x\` \`b\` で基数
- 自作型は \`impl fmt::Display\` で \`{}\` 対応、\`to_string()\` も手に入る`,
    hints: [
      "`{}` は Display、`{:?}` は Debug、`{:#?}` は複数行の整形 Debug。",
      "書式は `{:埋め文字 寄せ 幅 .精度 型}` の順。例: `{:>8.2}` `{:08}` `{:#x}`。",
      "自作型を `{}` で表示するには `impl fmt::Display` を書き、中で `write!(f, ...)` を使う。",
      "`format!` は表示せずに `String` を返す。`write!` は書き込み先を指定できる。",
    ],
  },
  learn: {
    quiz: [
      {
        prompt: '`println!("{:?}", "hi")` の出力は？',
        choices: ['"hi"', "hi", "'hi'", 'Some("hi")'],
        answer: '"hi"',
        explain: "Debug 表示では文字列は引用符付きで表示される。`{}`（Display）なら hi。",
      },
      {
        prompt: "次の出力は？",
        snippet: `println!("[{:>5}]", 42);`,
        choices: ["[   42]", "[42   ]", "[ 42  ]", "[00042]"],
        answer: "[   42]",
        explain: "`>` は右寄せ、幅 5 なので左に空白 3 つ。",
      },
      {
        prompt: "次の出力は？",
        snippet: `println!("{:.2}", 2.0 / 3.0);`,
        choices: ["0.67", "0.66", "0.666", "0.6666666666666666"],
        answer: "0.67",
        explain: "`.2` は小数点以下 2 桁で四捨五入（丸め）される。",
      },
      {
        prompt: '`format!("{:#x}", 255)` の結果は？',
        choices: ['"0xff"', '"ff"', '"FF"', '"0b11111111"'],
        answer: '"0xff"',
        explain: "`x` は小文字 16 進、`#` で `0x` の接頭辞が付く。",
      },
      {
        prompt: '`let v = vec![1, 2]; println!("{}", v);` がコンパイルエラーになる理由は？',
        choices: [
          "Vec は Display を実装していないから",
          "Vec は表示できない型だから",
          "`{}` には文字列しか渡せないから",
          "v が借用されているから",
        ],
        answer: "Vec は Display を実装していないから",
        explain:
          "`{}` は Display を要求する。Vec は Debug のみ実装しているので `{:?}` を使う（E0277）。",
      },
      {
        prompt: "インライン変数の書き方として **正しくない** ものは？",
        snippet: `let x = 3;
let p = (1, 2);`,
        choices: [
          'println!("{p.0}");',
          'println!("{x}");',
          'println!("{x:>4}");',
          'println!("{x:?}");',
        ],
        answer: 'println!("{p.0}");',
        explain:
          "インライン変数に書けるのは変数名だけ。フィールドアクセスや式は引数で渡す必要がある。",
      },
      {
        prompt: "自作型に `impl fmt::Display` を書くと、追加で使えるようになるメソッドは？",
        choices: ["to_string()", "clone()", "to_owned()", "len()"],
        answer: "to_string()",
        explain: "Display を実装した型には ToString が自動実装される。",
      },
      {
        prompt: "`String` に `write!` で書き込むために必要な `use` は？",
        choices: [
          "use std::fmt::Write;",
          "use std::io::Write;",
          "use std::string::Write;",
          "何も要らない",
        ],
        answer: "use std::fmt::Write;",
        explain:
          "String は `std::fmt::Write` を実装している。ファイルや標準出力は `std::io::Write`。",
      },
    ],
  },
});
