import { defineProblem } from "../../../core/schemas";

export default defineProblem({
  id: "rust-learn-match-iflet",
  stage: "learn",
  language: "rust",
  scenario: "rust",
  copy: {
    title: "match / if let / let else / while let",
    prompt: `## match 式

\`match\` は値を上から順に **パターン** と照らし合わせ、最初に合った **腕（arm）** を実行する。JS の \`switch\` に似ているが、ずっと強力。

\`\`\`rust
let n = 3;
let name = match n {
    1 => "one",
    2 => "two",
    3 => "three",
    _ => "many",      // それ以外すべて
};
\`\`\`

- 形は \`パターン => 式,\`。腕の本体が複数行なら \`=> { ... }\` とブロックにする
- **match は式** なので値を返せる（すべての腕の型をそろえる）
- \`switch\` と違って **フォールスルーしない**（\`break\` 不要）

## 網羅性（exhaustiveness）

match は **すべての可能性を必ず扱わなければならない**。漏れていると **コンパイルエラー**（E0004）。

\`\`\`rust
enum Coin { Penny, Nickel, Dime, Quarter }

fn cents(c: Coin) -> u32 {
    match c {
        Coin::Penny => 1,
        Coin::Nickel => 5,
        Coin::Dime => 10,
        // Coin::Quarter を書き忘れると error[E0004]: non-exhaustive patterns
    }
}
\`\`\`

これが Rust の安全性の柱の 1 つ。後から enum にバリアントを足すと、**扱い忘れている match をコンパイラが全部教えてくれる**。

## _ （ワイルドカード）と変数で受ける

\`\`\`rust
match n {
    0 => println!("ゼロ"),
    _ => println!("ゼロ以外"),   // _ は何にでも合い、値は使わない
}

match n {
    0 => println!("ゼロ"),
    other => println!("{other} です"),  // 変数名なら何にでも合い、値を束縛する
}
\`\`\`

- \`_\` や変数パターンは何にでもマッチするので **最後の腕** に置く（前に置くと後ろの腕は到達不能で warning）
- 「何もしない」腕は \`_ => (),\` または \`_ => {}\`

## 値の束縛（データを取り出す）

enum のバリアントに入っているデータは、パターンの中に変数名を書くと取り出せる。

\`\`\`rust
enum Coin { Penny, Quarter(String) }   // Quarter は州名を持つ

fn cents(c: &Coin) -> u32 {
    match c {
        Coin::Penny => 1,
        Coin::Quarter(state) => {
            println!("{state} の 25 セント");
            25
        }
    }
}
\`\`\`

参照（\`&Coin\`）に対して match すると、束縛された \`state\` は自動的に \`&String\` になる（所有権を奪わない）。

## Option / Result の match

\`\`\`rust
fn plus_one(x: Option<i32>) -> Option<i32> {
    match x {
        None => None,
        Some(i) => Some(i + 1),
    }
}

let r: Result<i32, String> = "42".parse::<i32>().map_err(|e| e.to_string());
match r {
    Ok(n) => println!("数値 {n}"),
    Err(e) => println!("失敗: {e}"),
}
\`\`\`

None や Err を書き忘れると網羅性エラーになるので、**失敗ケースの処理漏れが起きない**。

## 複数パターン・範囲・ガード（さわり）

\`\`\`rust
match n {
    1 | 2 => "小",            // または
    3..=9 => "中",            // 範囲（両端を含む）
    x if x < 0 => "負",       // マッチガード
    _ => "大",
}
\`\`\`

詳しくは次の章（パターン詳細）で扱う。

## if let — 1 つのパターンだけ気にするとき

「Some のときだけ何かしたい、None なら何もしない」を match で書くと冗長になる。

\`\`\`rust
let config: Option<u8> = Some(3);

match config {
    Some(max) => println!("最大 {max}"),
    _ => (),
}

// 同じ意味
if let Some(max) = config {
    println!("最大 {max}");
}

// else も付けられる
if let Some(max) = config {
    println!("最大 {max}");
} else {
    println!("設定なし");
}
\`\`\`

- \`if let パターン = 式\` の \`=\` は代入ではなく「この形に当てはまるなら」の意味
- 網羅性チェックはされない（その分短く書ける）。何を見落としているか気をつけて使う
- \`else if let\` や普通の \`else if\` とつなげることもできる

## let else — 合わなければ早期脱出

「この形のはず。違ったら関数を抜ける」を書くための構文。成功時の変数を **外側のスコープで** そのまま使えるのがポイント。

\`\`\`rust
fn parse_pair(s: &str) -> Option<(i32, i32)> {
    let Some((a, b)) = s.split_once(',') else {
        return None;              // 合わなかったときの処理。必ず脱出（return / break / continue / panic）する
    };
    let Ok(x) = a.trim().parse::<i32>() else { return None };
    let Ok(y) = b.trim().parse::<i32>() else { return None };
    Some((x, y))                  // a, b, x, y がそのまま使える
}
\`\`\`

if let で書くとネストがどんどん深くなるところを、平らに書ける。\`else\` ブロックは **発散（脱出）しなければならない**（値を返して続行はできない）。

## while let — 合う間だけ繰り返す

\`\`\`rust
let mut stack = vec![1, 2, 3];
while let Some(top) = stack.pop() {
    println!("{top}");     // 3, 2, 1
}
// pop() が None を返したらループ終了
\`\`\`

イテレータの \`next()\`、キューからの取り出しなど「Option を返すものを尽きるまで処理する」のに便利。

## matches! マクロ

「パターンに合うかどうか」を \`bool\` で欲しいときは \`matches!\`。

\`\`\`rust
let c = 'x';
let is_lower = matches!(c, 'a'..='z');            // true
let is_some_even = matches!(Some(4), Some(n) if n % 2 == 0);  // true

enum Light { Red, Yellow, Green }
let l = Light::Red;
let stop = matches!(l, Light::Red | Light::Yellow);  // true
\`\`\`

これは \`match c { 'a'..='z' => true, _ => false }\` の短縮形。enum の値の比較に \`==\` を使うには \`PartialEq\` が必要だが、matches! ならそれも不要。

## 使い分けまとめ

| 書き方 | 使う場面 |
|---|---|
| \`match\` | 全部の場合を扱う。網羅性チェックあり。値を返す |
| \`if let\` | 1 つの形のときだけ処理（+ else） |
| \`let else\` | 期待する形でなければ早期 return して、以降は平らに書く |
| \`while let\` | 形に合う間だけループ |
| \`matches!\` | 形に合うかを bool で知りたい |`,
    hints: [
      "match はすべての場合を網羅しないとコンパイルエラー。`_` で残りをまとめて受けられる。",
      "パターンに変数名を書くと中のデータを取り出せる（`Some(v)`, `Ok(n)`）。",
      "`if let` は 1 パターンだけ、`let else` は合わなければ脱出、`while let` は合う間ループ。",
      "`matches!(値, パターン)` は bool を返す。",
    ],
  },
  learn: {
    quiz: [
      {
        prompt: "次の match がコンパイルエラーになる理由は？",
        snippet: `enum Dir { Up, Down, Left }
fn f(d: Dir) -> i32 {
    match d {
        Dir::Up => 1,
        Dir::Down => 2,
    }
}`,
        choices: [
          "Dir::Left を扱っておらず網羅していないから",
          "match は値を返せないから",
          "break がないから",
          "enum に PartialEq がないから",
        ],
        answer: "Dir::Left を扱っておらず網羅していないから",
        explain:
          "match は全バリアントを扱う必要がある（E0004）。`Dir::Left => 3` か `_ => ..` を足す。",
      },
      {
        prompt: "`_ =>` の腕を match の先頭に置くとどうなる？",
        choices: [
          "すべてその腕に合い、後ろの腕に到達しない（warning）",
          "最後に回して評価される",
          "コンパイルエラーになる",
          "ランダムに選ばれる",
        ],
        answer: "すべてその腕に合い、後ろの腕に到達しない（warning）",
        explain: "match は上から順に試す。`_` は何にでも合うので、通常は最後に置く。",
      },
      {
        prompt: "`match opt { Some(v) => v * 2, None => 0 }` で opt が Some(5) のときの値は？",
        choices: ["10", "5", "Some(10)", "0"],
        answer: "10",
        explain:
          "Some(v) のパターンで v に 5 が束縛され、腕の値 `v * 2` = 10 が match 全体の値になる。",
      },
      {
        prompt: "次の 2 つの書き方について正しいのは？",
        snippet: `match x { Some(n) => println!("{n}"), _ => () }

if let Some(n) = x { println!("{n}"); }`,
        choices: [
          "同じ動作をする",
          "if let のほうは None で panic する",
          "if let は網羅性チェックがあるので None を書かないとエラー",
          "match のほうはコンパイルエラー",
        ],
        answer: "同じ動作をする",
        explain:
          "1 つのパターンだけ扱う match は if let で短く書ける。if let は網羅性チェックをしない。",
      },
      {
        prompt: "`let Some(x) = opt else { ... };` の else ブロックに書かなければならないのは？",
        choices: [
          "return / break / continue / panic などの脱出",
          "x の既定値",
          "何も書かなくてよい",
          "もう一度 let を書く",
        ],
        answer: "return / break / continue / panic などの脱出",
        explain:
          "let else の else は発散（脱出）しなければならない。合ったときだけ x が以降で使える。",
      },
      {
        prompt: "次のコードの出力は？",
        snippet: `let mut v = vec![1, 2, 3];
while let Some(t) = v.pop() {
    print!("{t}");
}`,
        choices: ["321", "123", "12", "無限ループ"],
        answer: "321",
        explain: "pop は末尾から取り出し、空になると None を返してループが終わる。",
      },
      {
        prompt: "`matches!('7', '0'..='9')` の値は？",
        choices: ["true", "false", "Some('7')", "コンパイルエラー"],
        answer: "true",
        explain: "matches! はパターンに合えば true を返す。'0'..='9' は文字の範囲パターン。",
      },
    ],
  },
});
