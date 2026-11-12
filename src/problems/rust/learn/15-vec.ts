import { defineProblem } from "../../../core/schemas";

export default defineProblem({
  id: "rust-learn-vec",
  stage: "learn",
  language: "rust",
  scenario: "rust",
  copy: {
    title: "Vec<T>（可変長配列）",
    prompt: `## Vec<T> とは

**\`Vec<T>\`（ベクタ）** は、同じ型 \`T\` の値を **いくつでも** 並べて持てる、伸び縮みする配列。JS の配列に一番近い。

| | 配列 \`[T; N]\` | \`Vec<T>\` |
|---|---|---|
| 長さ | コンパイル時に固定 | 実行中に増減できる |
| 置き場所 | スタック（その場） | 中身はヒープ |
| 例 | \`[1, 2, 3]\` | \`vec![1, 2, 3]\` |

JS の配列と違い、**全要素が同じ型** でなければならない（\`vec![1, "a"]\` はエラー）。違う種類を混ぜたいなら enum を要素にする。

## 作る

\`\`\`rust
let v1: Vec<i32> = Vec::new();        // 空。要素の型を注釈する（後で push すれば推論も可）
let v2 = vec![1, 2, 3];               // vec! マクロで初期値つき
let v3 = vec![0; 5];                  // [0, 0, 0, 0, 0]（同じ値を 5 個）
let v4: Vec<i32> = Vec::with_capacity(100); // 100 個分の領域を先に確保（長さは 0）
let v5: Vec<i32> = (1..=5).collect(); // イテレータから
let v6 = "a,b".split(',').collect::<Vec<&str>>();
\`\`\`

### 長さ（len）と容量（capacity）

Vec は内部で「確保済みの領域（capacity）」と「実際に入っている個数（len）」を持つ。push で容量が足りなくなると、**より大きな領域を確保して全要素を引っ越す**（容量はだいたい倍々で増える）。
要素数の見当が付いているなら \`with_capacity\` で引っ越しの回数を減らせる。

## 追加・削除

\`\`\`rust
let mut v = vec![10, 20, 30];
v.push(40);            // 末尾に追加     → [10, 20, 30, 40]
let last = v.pop();    // 末尾を取り出す → Some(40)。空なら None
v.insert(1, 15);       // 位置 1 に挿入  → [10, 15, 20, 30]
let x = v.remove(0);   // 位置 0 を削除して返す → 10、v = [15, 20, 30]
v.len();               // 3
v.is_empty();          // false
v.clear();             // 全部消す
v.extend([1, 2, 3]);   // まとめて追加
v.truncate(1);         // 先頭 1 個だけ残す
\`\`\`

- 変更するには \`let mut\` が必要
- \`insert\` / \`remove\` は後ろの要素を全部ずらすので O(n)。末尾の \`push\` / \`pop\` は O(1)
- \`remove\` / \`insert\` は範囲外の位置で **panic**
- \`swap_remove(i)\` は末尾の要素で穴を埋める（順序は崩れるが O(1)）

## 読む: 添字と get

\`\`\`rust
let v = vec![1, 2, 3];
let a: i32 = v[0];              // 添字。範囲外なら panic!
let b: Option<&i32> = v.get(1); // Some(&2)
let c = v.get(10);              // None（panic しない）
let first = v.first();          // Some(&1)
let last = v.last();            // Some(&3)
let part: &[i32] = &v[1..];     // スライス [2, 3]
\`\`\`

| 書き方 | 範囲外のとき | 使いどころ |
|---|---|---|
| \`v[i]\` | **panic** | 絶対に範囲内と分かっているとき |
| \`v.get(i)\` | \`None\` | 範囲外もありうるとき（ユーザー入力など） |

添字は \`usize\` 型。\`i32\` の変数で添字にするなら \`v[i as usize]\`。JS のように範囲外で \`undefined\` が返ってくることはない。

## イテレート（3 種類の for）

\`\`\`rust
let mut v = vec![1, 2, 3];

for x in &v {          // 不変借用: x は &i32。v は後でも使える
    println!("{x}");
}

for x in &mut v {      // 可変借用: x は &mut i32。中身を書き換えられる
    *x *= 10;          // * で参照外しして書き換え
}

for x in v {           // 所有権ごと: x は i32。ループ後 v は使えない（ムーブ）
    println!("{x}");
}
// println!("{:?}", v);  // エラー: v はムーブ済み
\`\`\`

| 書き方 | 要素の型 | ループ後の v | 同じ意味のメソッド |
|---|---|---|---|
| \`for x in &v\` | \`&T\` | 使える | \`v.iter()\` |
| \`for x in &mut v\` | \`&mut T\` | 使える（変更済み） | \`v.iter_mut()\` |
| \`for x in v\` | \`T\` | **使えない** | \`v.into_iter()\` |

番号も欲しいなら \`for (i, x) in v.iter().enumerate()\`。

## 借用ルールと Vec

次のコードはコンパイルエラーになる。

\`\`\`rust
let mut v = vec![1, 2, 3];
let first = &v[0];     // v を不変借用
v.push(4);             // v を可変借用 → error[E0502]
println!("{first}");   // first をまだ使っている
\`\`\`

「1 個追加するだけなのに、なぜ先頭の参照がダメ？」と思うかもしれない。理由は **push で領域が引っ越すと、first が指していた古いメモリが解放される** から。C/C++ ではこれが「ダングリングポインタ」の典型的なバグになるが、Rust は借用ルールでコンパイル時に防ぐ。

同様に、**ループ中にその Vec 自身へ push / remove することはできない**。

\`\`\`rust
for x in &v {
    // v.push(*x);   // エラー: 不変借用中に可変借用
}
\`\`\`

対処: 値をコピーしておく（\`let first = v[0];\`、i32 は Copy）、別の Vec に集めてから後で追加する、添字ループにする、\`retain\` を使う、など。

## 並べ替え・探索・整理

\`\`\`rust
let mut v = vec![3, 1, 4, 1, 5, 9, 2, 6];

v.sort();                         // 昇順 [1, 1, 2, 3, 4, 5, 6, 9]
v.sort_by(|a, b| b.cmp(a));       // 降順（比較関数を渡す）
v.sort_by_key(|x| (x % 3, *x));   // キーで並べる
v.reverse();                      // 逆順

v.sort();
v.dedup();                        // 隣り合う重複を除く → [1, 2, 3, 4, 5, 6, 9]
v.retain(|&x| x % 2 == 1);        // 条件を満たすものだけ残す → [1, 3, 5, 9]

v.contains(&3);                   // true（引数は参照）
v.iter().position(|&x| x == 5);   // Some(2)（見つかった位置）
v.iter().max();                   // Some(&9)
v.iter().sum::<i32>();            // 18
v.binary_search(&5);              // Ok(2)（ソート済みのときだけ使う）
\`\`\`

- \`sort\` は **安定ソート**（同じキーの要素の順序を保つ）。\`sort_unstable\` は少し速い
- \`f64\` は \`NaN\` があるので \`sort()\` できない（\`Ord\` がない）。\`v.sort_by(|a, b| a.partial_cmp(b).unwrap())\` または \`a.total_cmp(b)\`
- \`dedup\` は **隣り合った** 重複しか消さない。全体の重複を消すなら先に \`sort\`
- 文字列なら \`v.sort_by_key(|s| s.len())\` で長さ順など

## 2 次元 Vec

\`\`\`rust
let mut grid = vec![vec![0; 3]; 2];   // 2 行 3 列、全部 0
grid[1][2] = 7;
// [[0, 0, 0], [0, 0, 7]]

let rows = grid.len();        // 2
let cols = grid[0].len();     // 3

for row in &grid {
    for cell in row {
        print!("{cell} ");
    }
    println!();
}
\`\`\`

\`vec![vec![0; 3]; 2]\` は内側の Vec を **clone して** 2 つ作るので、JS の \`Array(2).fill([])\` のように同じ配列を共有してしまう罠はない。

## Vec を関数に渡す

\`\`\`rust
fn sum(v: &[i32]) -> i32 { v.iter().sum() }    // 読むだけ → スライス &[T] で受けるのが定番
fn add_one(v: &mut Vec<i32>) { v.push(1); }    // 伸び縮みさせる → &mut Vec<T>
fn double(v: &mut [i32]) { for x in v { *x *= 2; } } // 中身だけ書き換え → &mut [T]

let mut v = vec![1, 2];
sum(&v);          // &Vec<i32> は自動で &[i32] になる
add_one(&mut v);
\`\`\`

引数を \`&[T]\` にすると、Vec でも配列でもスライスでも受け取れて便利。`,
    hints: [
      "`vec![..]` / `Vec::new()` / `Vec::with_capacity(n)` で作り、`push` / `pop` / `insert` / `remove` で増減。",
      "`v[i]` は範囲外で panic、`v.get(i)` は Option。",
      "`for x in &v` / `&mut v` / `v` で借用・可変借用・ムーブが変わる。",
      "要素への参照を持ったまま push はできない（再確保で参照が無効になるため）。",
    ],
  },
  learn: {
    quiz: [
      {
        prompt: "`let v = vec![1, 2, 3]; v.get(5)` の結果は？",
        choices: ["None", "panic", "0", "コンパイルエラー"],
        answer: "None",
        explain: "get は範囲外でも panic せず None を返す。`v[5]` なら panic する。",
      },
      {
        prompt: "次のコードがコンパイルエラーになる理由は？",
        snippet: `let mut v = vec![1, 2, 3];
let first = &v[0];
v.push(4);
println!("{first}");`,
        choices: [
          "push で再確保されると first が無効になりうるので、借用中の変更が禁止されている",
          "push は mut でない Vec に使えないから",
          "first の型が i32 でないから",
          "println! に参照を渡せないから",
        ],
        answer: "push で再確保されると first が無効になりうるので、借用中の変更が禁止されている",
        explain: "不変借用 first が生きている間に可変借用（push）はできない（E0502）。",
      },
      {
        prompt: "`for x in v { ... }`（& なし）のループ後に v を使うと？",
        choices: [
          "コンパイルエラー（v はムーブされた）",
          "普通に使える",
          "空の Vec になっている",
          "panic する",
        ],
        answer: "コンパイルエラー（v はムーブされた）",
        explain: "`for x in v` は into_iter で所有権ごと消費する。後でも使うなら `&v` で回す。",
      },
      {
        prompt: "Vec の各要素を 2 倍に書き換えるループは？",
        choices: [
          "for x in &mut v { *x *= 2; }",
          "for x in &v { x *= 2; }",
          "for x in v { x *= 2; }",
          "for x in &v { *x *= 2; }",
        ],
        answer: "for x in &mut v { *x *= 2; }",
        explain: "可変借用で回し、`*x` で参照外しして書き換える。",
      },
      {
        prompt: "`let mut v = vec![1, 2, 1, 2]; v.dedup();` の後の v は？",
        choices: ["[1, 2, 1, 2]", "[1, 2]", "[1, 1, 2, 2]", "[2, 1]"],
        answer: "[1, 2, 1, 2]",
        explain: "dedup は隣り合う重複だけを消す。全体の重複を消したいなら先に sort する。",
      },
      {
        prompt: "`v.retain(|&x| x > 2)` の効果は？",
        choices: [
          "2 より大きい要素だけを残す",
          "2 より大きい要素を削除する",
          "2 より大きい最初の要素を返す",
          "要素数が 2 より大きいか調べる",
        ],
        answer: "2 より大きい要素だけを残す",
        explain: "retain は条件が true の要素を残し、それ以外をその場で削除する。",
      },
      {
        prompt: "`let mut g = vec![vec![0; 3]; 2]; g[0][1] = 5;` の後の g は？",
        choices: [
          "[[0, 5, 0], [0, 0, 0]]",
          "[[0, 5, 0], [0, 5, 0]]",
          "[[0, 0], [5, 0], [0, 0]]",
          "コンパイルエラー",
        ],
        answer: "[[0, 5, 0], [0, 0, 0]]",
        explain: "内側の Vec は clone されて別々なので、片方の変更はもう片方に影響しない。",
      },
      {
        prompt: "Vec を読むだけの関数の引数の型として、一番汎用的なのは？",
        choices: ["&[i32]", "Vec<i32>", "&mut Vec<i32>", "[i32; 3]"],
        answer: "&[i32]",
        explain: "スライス参照なら Vec・配列・部分スライスのどれでも受け取れ、所有権も奪わない。",
      },
    ],
  },
});
