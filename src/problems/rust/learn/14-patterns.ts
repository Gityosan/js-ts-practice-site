import { defineProblem } from "../../../core/schemas";

export default defineProblem({
  id: "rust-learn-patterns",
  stage: "learn",
  language: "rust",
  scenario: "rust",
  copy: {
    title: "パターン詳細（分割代入・ガード・@・スライス）",
    prompt: `## パターンはどこにでも出てくる

パターンは match だけのものではない。次の場所はすべてパターンを書ける。

| 場所 | 例 |
|---|---|
| \`match\` の腕 | \`Some(x) => ...\` |
| \`if let\` / \`while let\` / \`let else\` | \`if let Ok(n) = r\` |
| \`let\` 文 | \`let (a, b) = (1, 2);\` |
| \`for\` | \`for (i, x) in v.iter().enumerate()\` |
| 関数の引数 | \`fn f(&(x, y): &(i32, i32))\` |
| クロージャの引数 | \`|(k, v)| ...\` |

\`let\` や関数引数のように「必ず合わないと困る」場所には **反駁不可能（irrefutable）** なパターンしか書けない（\`let Some(x) = opt;\` はエラー → \`let else\` を使う）。

## リテラル

\`\`\`rust
match x {
    0 => "ゼロ",
    1 => "いち",
    _ => "その他",
}
match s {                // &str もリテラルでマッチできる
    "yes" | "y" => true,
    _ => false,
}
\`\`\`

## 範囲 ..=

\`\`\`rust
match score {
    90..=100 => 'A',
    70..=89 => 'B',
    0..=69 => 'C',
    _ => '?',
}
match c {
    'a'..='z' | 'A'..='Z' => "英字",
    '0'..='9' => "数字",
    _ => "その他",
}
\`\`\`

- パターンでは **\`..=\`（両端を含む）** を使う。整数と \`char\` に使える
- 上限なし \`100..\` や上限未満 \`..10\` も書ける（\`..10\` は 9 まで）

## | （または）

\`1 | 3 | 5 => ...\` のように複数のパターンを 1 つの腕にまとめる。束縛する変数がある場合は、どの選択肢でも同じ名前・同じ型で束縛する必要がある。

## 分割代入（destructuring）

### タプル

\`\`\`rust
let (a, b, c) = (1, 'x', true);
let ((x1, y1), (x2, y2)) = ((0, 0), (3, 4));   // ネスト

match (x, y) {
    (0, 0) => "原点",
    (0, _) => "y 軸上",
    (_, 0) => "x 軸上",
    _ => "その他",
}
\`\`\`

### 構造体

\`\`\`rust
struct Point { x: i32, y: i32 }
let p = Point { x: 3, y: -1 };

let Point { x, y } = p;              // フィールド名と同じ変数に取り出す
let Point { x: px, y: py } = p;      // 別名を付ける

match p {
    Point { x: 0, y } => println!("y 軸上の {y}"),   // 一部をリテラルで固定
    Point { x, y: 0 } => println!("x 軸上の {x}"),
    Point { x, y } => println!("({x}, {y})"),
}
\`\`\`

### enum とネスト

\`\`\`rust
enum Shape { Circle { r: f64 }, Rect { w: f64, h: f64 } }
enum Event { Click(i32, i32), Draw(Shape), Key(char) }

match ev {
    Event::Click(x, y) => ...,
    Event::Draw(Shape::Circle { r }) => ...,          // enum の中の enum
    Event::Draw(Shape::Rect { w, h }) if w == h => ..., // 正方形だけ
    Event::Draw(Shape::Rect { .. }) => ...,
    Event::Key('q') => ...,
    Event::Key(c) => ...,
}
\`\`\`

### 参照の分割

\`\`\`rust
let pairs = vec![(1, 'a'), (2, 'b')];
for &(n, c) in &pairs {      // 要素は &(i32, char)。&(..) パターンで中身をコピーして取り出す
    println!("{n}{c}");
}
for (n, c) in &pairs {       // こう書くと n: &i32, c: &char（デフォルト束縛モード）
    println!("{n}{c}");
}
\`\`\`

参照に対して \`&\` なしのパターンを書くと、Rust は自動で「参照の中を見て、束縛は参照にする」（**デフォルト束縛モード / match ergonomics**）。\`&pat\` と明示すると、中の値をコピーして取り出す（Copy 型のみ）。

## .. で残りを無視

\`\`\`rust
struct P3 { x: i32, y: i32, z: i32 }
let P3 { x, .. } = p;              // y と z は無視

let (first, .., last) = (1, 2, 3, 4, 5);   // first = 1, last = 5

match msg {
    Message::Move { x, .. } => ...,   // 他のフィールドは気にしない
}
\`\`\`

- \`_\` は「1 つ分を無視」、\`..\` は「残り全部を無視」
- \`..\` は 1 つのパターンに 1 回だけ（\`(.., x, ..)\` はどこか曖昧なのでエラー）
- \`_x\` のように \`_\` で始まる変数名は「使わないけど束縛する」（未使用 warning が出ない）。\`_\` は束縛すらしないので所有権も移らない

## マッチガード if

パターンの後に \`if 条件\` を付けると、**パターンに合い、かつ条件が真** のときだけその腕が選ばれる。

\`\`\`rust
match n {
    Some(x) if x < 0 => "負",
    Some(x) if x % 2 == 0 => "偶数",
    Some(_) => "奇数",
    None => "なし",
}

match (a, b) {
    (x, y) if x == y => "同じ",
    (x, y) if x + y == 0 => "符号違い",
    _ => "その他",
}
\`\`\`

ガードは網羅性チェックでは考慮されない（コンパイラは条件の中身まで調べない）ので、最後にガードなしの腕が必要になることが多い。

## @ バインディング

「範囲などで条件を確かめつつ、その値自体も変数で受け取りたい」ときは \`名前 @ パターン\`。

\`\`\`rust
match age {
    n @ 0..=12 => format!("{n} 歳: 子ども"),
    n @ 13..=19 => format!("{n} 歳: ティーン"),
    n => format!("{n} 歳: 大人"),
}

match msg {
    Message::Hello { id: id_var @ 3..=7 } => println!("範囲内の id {id_var}"),
    Message::Hello { id } => println!("その他の id {id}"),
}
\`\`\`

\`3..=7\` だけだと値を変数に取れない。\`n\` だけだと範囲を確かめられない。\`@\` で両方できる。

## ref / ref mut

パターンで値を取り出すと、通常は **ムーブ（またはコピー）** になる。所有権を奪わず **参照として** 束縛したいときに \`ref\` を付ける。

\`\`\`rust
let name = Some(String::from("Ferris"));
match name {
    Some(ref s) => println!("{s}"),   // s: &String。name はムーブされない
    None => {}
}
println!("{name:?}");                 // まだ使える

let mut pt = (1, 2);
let (ref mut a, _) = pt;              // a: &mut i32
*a += 10;                             // pt は (11, 2)
\`\`\`

現代の Rust では \`match &name { Some(s) => ... }\` のように **参照に対して match** すれば同じことができるので、\`ref\` を書く機会は減っている。読めるようにしておこう。

## スライスパターン

配列やスライスも形でマッチできる。

\`\`\`rust
fn describe(v: &[i32]) -> String {
    match v {
        [] => "空".to_string(),
        [x] => format!("1 つ: {x}"),
        [first, second] => format!("2 つ: {first}, {second}"),
        [first, .., last] => format!("先頭 {first} … 末尾 {last}"),
    }
}

match v {
    [first, rest @ ..] => ...,   // rest は残りのスライス &[i32]
    [] => ...,
}
match v {
    [.., a, b] => ...,          // 末尾 2 つ
    _ => ...,
}
\`\`\`

- \`..\` は「0 個以上の要素」。\`rest @ ..\` で残りをスライスとして受け取れる
- 長さごとに場合分けでき、網羅性もチェックされる（\`[]\` と \`[_, ..]\` で全部）
- 添字アクセス \`v[0]\` と違って **範囲外で panic しない**`,
    hints: [
      "範囲は `1..=5`、複数は `|`、無視は `_`（1 つ）と `..`（残り全部）。",
      "構造体・タプル・enum はネストしても分割できる。参照には `&(a, b)` パターンも使える。",
      "`if` のマッチガードで条件を足し、`n @ 1..=9` で範囲チェックしつつ値を束縛する。",
      "スライスパターン `[first, .., last]` / `[head, rest @ ..]` で長さごとに分ける。",
    ],
  },
  learn: {
    quiz: [
      {
        prompt: '`match n { 1..=5 => "A", _ => "B" }` で n が 5 のときは？',
        choices: ['"A"', '"B"', "コンパイルエラー", "panic"],
        answer: '"A"',
        explain: "`..=` は上端を含む範囲。5 も 1..=5 に入る。",
      },
      {
        prompt: "次のコードで x と y の値は？",
        snippet: `struct P { x: i32, y: i32, z: i32 }
let P { x, y: yy, .. } = P { x: 1, y: 2, z: 3 };`,
        choices: [
          "x = 1、yy = 2（y という変数はない）",
          "x = 1、y = 2",
          "x = 1、yy = 3",
          "コンパイルエラー",
        ],
        answer: "x = 1、yy = 2（y という変数はない）",
        explain: "`y: yy` はフィールド y を変数 yy に取り出す別名指定。`..` で z は無視。",
      },
      {
        prompt: "`let (first, .., last) = (1, 2, 3, 4);` の結果は？",
        choices: [
          "first = 1, last = 4",
          "first = 1, last = 2",
          "first = (1, 2), last = (3, 4)",
          "コンパイルエラー",
        ],
        answer: "first = 1, last = 4",
        explain: "`..` は間の残りすべてを無視する。",
      },
      {
        prompt: "次の match で n = Some(4) のときの値は？",
        snippet: `match n {
    Some(x) if x > 5 => "big",
    Some(x) if x % 2 == 0 => "even",
    Some(_) => "odd",
    None => "none",
}`,
        choices: ['"even"', '"big"', '"odd"', '"none"'],
        answer: '"even"',
        explain: "1 つ目はガード x > 5 が偽なので飛ばされ、2 つ目のガードが真になる。",
      },
      {
        prompt: "`n @ 13..=19 => ...` の `@` の役割は？",
        choices: [
          "範囲に合うか確かめつつ、その値を n に束縛する",
          "n のアドレスを取る",
          "n を参照で受け取る",
          "n を無視する",
        ],
        answer: "範囲に合うか確かめつつ、その値を n に束縛する",
        explain: "範囲パターンだけでは値を受け取れないので、@ で名前を付ける。",
      },
      {
        prompt: "`match opt { Some(ref s) => ..., None => ... }` の `ref` の効果は？",
        choices: [
          "s を参照として束縛し、opt の中身をムーブしない",
          "s を可変にする",
          "s をコピーする",
          "opt を None にする",
        ],
        answer: "s を参照として束縛し、opt の中身をムーブしない",
        explain: "ref は「参照で束縛」。`match &opt { Some(s) => ... }` と書いても同じ効果。",
      },
      {
        prompt: "`v: &[i32]` が `[10, 20, 30, 40]` のとき、`[a, rest @ ..]` の rest は？",
        choices: ["[20, 30, 40]（スライス）", "40", "[10, 20, 30]", "3（個数）"],
        answer: "[20, 30, 40]（スライス）",
        explain: "`rest @ ..` は残りの要素をスライス &[i32] として束縛する。",
      },
      {
        prompt: "`let Some(x) = opt;` がコンパイルエラーになる理由は？",
        choices: [
          "let には必ず合うパターンしか書けず、None の場合がありうるから",
          "Some は関数だから",
          "x に型注釈がないから",
          "opt が mut でないから",
        ],
        answer: "let には必ず合うパターンしか書けず、None の場合がありうるから",
        explain:
          "let は反駁不可能なパターンのみ。合わないことがあるなら `let ... else` / `if let` / match を使う。",
      },
    ],
  },
});
