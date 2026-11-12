import { defineProblem } from "../../../core/schemas";

export default defineProblem({
  id: "rust-learn-std-traits-derive",
  stage: "learn",
  language: "rust",
  scenario: "rust",
  copy: {
    title: "よく使う標準トレイトと derive",
    prompt: `## derive とは

\`#[derive(...)]\` は、標準トレイトの実装を **コンパイラに自動生成させる** 属性。

\`\`\`rust
#[derive(Debug, Clone, PartialEq)]
struct Point {
    x: i32,
    y: i32,
}
\`\`\`

これだけで \`{:?}\` での表示、\`.clone()\`、\`==\` が使えるようになる。手で \`impl\` を書くこともできるが、多くの場合 derive で十分。

**derive の条件**: 基本的に「**すべてのフィールドがそのトレイトを実装していること**」。例えば \`f64\` のフィールドを持つ構造体には \`Eq\` / \`Ord\` / \`Hash\` を derive できない（f64 がそれらを実装していないから）。

## 一覧

| トレイト | できるようになること | derive の条件・注意 |
|---|---|---|
| \`Debug\` | \`{:?}\` / \`{:#?}\` で表示 | 全フィールドが Debug |
| \`Clone\` | \`.clone()\` で複製 | 全フィールドが Clone |
| \`Copy\` | 代入・引数渡しで move せずコピー | **Clone も必要**。全フィールドが Copy（String や Vec を含むと不可） |
| \`PartialEq\` | \`==\` / \`!=\` | 全フィールドが PartialEq |
| \`Eq\` | 「完全な等価性」の印（中身はない） | **PartialEq も必要**。f64 を含むと不可 |
| \`Hash\` | HashMap のキー、HashSet の要素 | 全フィールドが Hash。通常 Eq と一緒に |
| \`PartialOrd\` | \`<\` \`>\` \`<=\` \`>=\`、\`partial_cmp\` | **PartialEq も必要** |
| \`Ord\` | \`cmp\`、\`.sort()\`、\`.max()\`、BTreeMap のキー | **Eq と PartialOrd も必要** |
| \`Default\` | \`Default::default()\` で既定値 | 全フィールドが Default（数値 0, bool false, String 空, Vec 空, Option None） |

## Debug

\`\`\`rust
#[derive(Debug)]
struct User { name: String, age: u32 }

let u = User { name: "Ann".into(), age: 30 };
println!("{:?}", u);   // User { name: "Ann", age: 30 }
println!("{:#?}", u);  // 複数行で整形して表示
\`\`\`

開発中の確認用。ほぼすべての自作型に付けておくのが普通。\`assert_eq!\` の失敗表示にも Debug が要る。

## Clone と Copy

- **Clone**: \`.clone()\` を **明示的に** 呼んで複製する。中身がヒープにある \`String\` のように重い複製もありうる
- **Copy**: 代入や関数呼び出しで **暗黙に** ビット単位でコピーされる。move が起きなくなる

\`\`\`rust
#[derive(Debug, Clone, Copy)]
struct Pos { x: i32, y: i32 }

let a = Pos { x: 1, y: 2 };
let b = a;              // Copy なのでコピー。a はまだ使える
println!("{:?}", a);    // OK

#[derive(Debug, Clone)]
struct Name { s: String }  // String は Copy でないので Copy は derive できない
let n = Name { s: "x".into() };
let m = n.clone();       // 明示的に複製
\`\`\`

Copy は「安くコピーできる小さな値」（整数、浮動小数、bool、char、それらだけのタプルや構造体）にだけ付ける。

## PartialEq と Eq

- \`PartialEq\` があると \`==\` が使える。derive すると **全フィールドが等しいとき等しい** になる
- \`Eq\` は「どんな値も自分自身と等しい（a == a が常に成り立つ）」という **約束の印**
- **f64 は PartialEq だけで Eq ではない**。\`f64::NAN == f64::NAN\` が \`false\` になるから

\`\`\`rust
let nan = f64::NAN;
println!("{}", nan == nan); // false !
\`\`\`

## Hash

\`HashMap\` のキーや \`HashSet\` の要素にするには \`Hash\` と \`Eq\` が必要。

\`\`\`rust
use std::collections::HashSet;

#[derive(Debug, Clone, Copy, PartialEq, Eq, Hash)]
struct Pos { x: i32, y: i32 }

let mut seen = HashSet::new();
seen.insert(Pos { x: 0, y: 0 });
seen.insert(Pos { x: 0, y: 0 }); // 同じ値なので増えない
println!("{}", seen.len()); // 1
\`\`\`

約束: **a == b なら hash(a) == hash(b)** でなければならない。derive すればこれが自動で守られる。手で片方だけ実装すると壊れるので注意。

## PartialOrd と Ord（比較とソート）

- \`PartialOrd\`: \`<\` などが使える。比較できない組み合わせがありうる（f64 の NaN）。\`partial_cmp\` は \`Option<Ordering>\` を返す
- \`Ord\`: **必ず** 大小が決まる全順序。\`cmp\` は \`Ordering\`（\`Less\` / \`Equal\` / \`Greater\`）を返す
- \`Vec::sort()\`、\`iter().max()\` / \`min()\`、\`BTreeMap\` のキーには **Ord** が必要

### derive したときの順序

- **構造体**: フィールドを **上から順に** 比べる（辞書式）。最初に差がついたフィールドで決まる
- **enum**: **先に書いたバリアントほど小さい**

\`\`\`rust
#[derive(Debug, PartialEq, Eq, PartialOrd, Ord)]
struct Version { major: u32, minor: u32, patch: u32 }

let mut v = vec![
    Version { major: 1, minor: 2, patch: 0 },
    Version { major: 0, minor: 9, patch: 9 },
    Version { major: 1, minor: 0, patch: 5 },
];
v.sort(); // 0.9.9 → 1.0.5 → 1.2.0

#[derive(Debug, PartialEq, Eq, PartialOrd, Ord)]
enum Level { Low, Mid, High }
println!("{}", Level::Low < Level::High); // true
\`\`\`

**フィールドの並び順が比較の優先順位になる** ので、構造体の定義順には意味がある。

### 手で Ord を実装する

並び順を自分で決めたいときは \`Ord\` を手で書く。\`PartialOrd\` は \`Some(self.cmp(other))\` に任せるのが定石。

\`\`\`rust
use std::cmp::Ordering;

#[derive(Debug, PartialEq, Eq)]
struct Player { name: String, score: u32 }

impl Ord for Player {
    fn cmp(&self, other: &Self) -> Ordering {
        other.score.cmp(&self.score)               // スコアの降順（other と self を逆に）
            .then_with(|| self.name.cmp(&other.name)) // 同点なら名前の昇順
    }
}

impl PartialOrd for Player {
    fn partial_cmp(&self, other: &Self) -> Option<Ordering> {
        Some(self.cmp(other))
    }
}
\`\`\`

### f64 のソート

f64 は Ord ではないので \`v.sort()\` は使えない（\`error[E0277]\`）。\`sort_by\` と \`total_cmp\`（または \`partial_cmp\`）を使う。

\`\`\`rust
let mut xs = vec![2.5, -1.0, 0.3];
xs.sort_by(|a, b| a.total_cmp(b));
\`\`\`

## Default

\`Default::default()\` で「既定値」を作る。derive すると各フィールドの既定値（0、false、空文字列…）になる。

\`\`\`rust
#[derive(Debug, Default)]
struct Stats { count: u32, total: i64, label: String }

let s = Stats::default(); // Stats { count: 0, total: 0, label: "" }
\`\`\`

既定値を自分で決めたいときは手で実装する。**構造体更新構文** \`..Default::default()\` と相性がよい。

\`\`\`rust
struct Config { port: u16, verbose: bool }

impl Default for Config {
    fn default() -> Self {
        Config { port: 8080, verbose: false }
    }
}

let c = Config { verbose: true, ..Default::default() }; // port は 8080
\`\`\`

## Display と to_string

\`Display\` は **ユーザー向けの表示**（\`{}\`）。**derive できない**（どう見せるかは型ごとに違うから）ので、手で実装する。

\`\`\`rust
use std::fmt;

struct Point { x: i32, y: i32 }

impl fmt::Display for Point {
    fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
        write!(f, "({}, {})", self.x, self.y)
    }
}

let p = Point { x: 1, y: 2 };
println!("{}", p);          // (1, 2)
let s: String = p.to_string(); // "(1, 2)"
\`\`\`

- \`write!(f, ...)\` は \`format!\` と同じ書式で \`f\` に書き込み、\`fmt::Result\` を返す
- **Display を実装すると \`.to_string()\` が自動で使える**（標準ライブラリに \`impl<T: Display> ToString for T\` というブランケット実装があるため）
- Debug（開発者向け、\`{:?}\`）と Display（利用者向け、\`{}\`）は役割が違う

## まとめ

- 迷ったら \`#[derive(Debug, Clone, PartialEq)]\` から。値として小さいなら \`Copy\`、キーにするなら \`Eq, Hash\`、ソートするなら \`Eq, PartialOrd, Ord\`
- 依存関係: Copy → Clone、Eq → PartialEq、Ord → Eq + PartialOrd、PartialOrd → PartialEq
- f64 を含む型は Eq / Ord / Hash を derive できない
- derive の比較はフィールド順 / バリアント順
- Display は手で実装し、\`to_string()\` がおまけで付いてくる`,
    hints: [
      "derive は全フィールドがそのトレイトを実装しているときだけ使える。",
      "Copy には Clone、Ord には Eq と PartialOrd が必要。",
      "derive した比較は構造体ならフィールドの定義順、enum ならバリアントの定義順。",
      "Display は derive できない。手で実装すると to_string() も使える。",
    ],
  },
  learn: {
    quiz: [
      {
        prompt: "次の構造体に `#[derive(Clone, Copy)]` を付けるとどうなる？",
        snippet: `struct User {
    name: String,
    age: u32,
}
`,
        choices: [
          "String が Copy でないのでエラー",
          "問題なくコンパイルできる",
          "name だけコピーされる",
          "実行時に panic する",
        ],
        answer: "String が Copy でないのでエラー",
        explain:
          "Copy は全フィールドが Copy のときだけ derive できる。String はヒープを持つので Copy ではない（Clone は可）。",
      },
      {
        prompt: "f64 のフィールドを持つ構造体に derive できないのは？",
        choices: ["Eq", "PartialEq", "Debug", "Clone"],
        answer: "Eq",
        explain:
          "NaN != NaN なので f64 は Eq（完全な等価性）を満たさない。同じ理由で Ord と Hash も derive できない。",
      },
      {
        prompt: "`Vec<T>` の `.sort()` を使うのに T が必要とするトレイトは？",
        choices: ["Ord", "PartialOrd だけ", "Hash", "Display"],
        answer: "Ord",
        explain:
          "sort は全順序（Ord）が必要。f64 のように PartialOrd しかない型は sort_by(|a, b| a.total_cmp(b)) などを使う。",
      },
      {
        prompt: "次の比較の結果は？",
        snippet: `#[derive(PartialEq, Eq, PartialOrd, Ord)]
struct V { major: u32, minor: u32 }

V { major: 1, minor: 0 } < V { major: 0, minor: 9 }
`,
        choices: ["false", "true", "コンパイルエラー", "None"],
        answer: "false",
        explain:
          "derive した比較はフィールドを上から順に比べる。major が 1 > 0 なので左のほうが大きい。",
      },
      {
        prompt: "`enum Level { Low, Mid, High }` に PartialOrd を derive したとき、正しいのは？",
        choices: [
          "Low < Mid < High",
          "High < Mid < Low",
          "名前のアルファベット順（High < Low < Mid）",
          "比較はできない",
        ],
        answer: "Low < Mid < High",
        explain: "enum は先に書いたバリアントほど小さい。",
      },
      {
        prompt: "`Display` を実装した型で自動的に使えるようになるメソッドは？",
        choices: ["to_string()", "clone()", "default()", "hash()"],
        answer: "to_string()",
        explain: "標準ライブラリの `impl<T: Display> ToString for T`（ブランケット実装）による。",
      },
      {
        prompt: "HashMap のキーにする自作の型に必要な derive の組み合わせは？",
        choices: ["PartialEq, Eq, Hash", "Debug だけ", "Clone, Copy", "PartialOrd, Ord"],
        answer: "PartialEq, Eq, Hash",
        explain:
          "HashMap は Hash でバケツを決め、Eq で同じキーか確かめる。a == b なら hash も等しいという約束を derive が守ってくれる。",
      },
      {
        prompt:
          "`#[derive(Default)] struct S { n: i32, s: String, v: Vec<u8>, b: bool }` の `S::default()` は？",
        choices: [
          'S { n: 0, s: "", v: [], b: false }',
          "コンパイルエラー",
          "None",
          'S { n: 1, s: " ", v: [0], b: true }',
        ],
        answer: 'S { n: 0, s: "", v: [], b: false }',
        explain: "各フィールドの型の既定値（数値は 0、bool は false、String / Vec は空）になる。",
      },
    ],
  },
});
