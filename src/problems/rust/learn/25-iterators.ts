import { defineProblem } from "../../../core/schemas";

export default defineProblem({
  id: "rust-learn-iterators",
  stage: "learn",
  language: "rust",
  scenario: "rust",
  copy: {
    title: "イテレータとアダプタ",
    prompt: `## イテレータとは

**イテレータ（iterator）** は「要素を 1 つずつ順番に取り出せるもの」。Rust では \`Iterator\` トレイトで表される。

\`\`\`rust
trait Iterator {
    type Item;                                  // 取り出す要素の型（関連型）
    fn next(&mut self) -> Option<Self::Item>;   // 次の要素。終わったら None
    // map, filter, sum ... など 70 以上のメソッドがデフォルト実装されている
}
\`\`\`

\`next\` を呼ぶたびに \`Some(要素)\` が返り、終わると \`None\` が返る。

\`\`\`rust
let v = vec![10, 20];
let mut it = v.iter();
println!("{:?}", it.next()); // Some(10)  ※実際は Some(&10)
println!("{:?}", it.next()); // Some(20)
println!("{:?}", it.next()); // None
\`\`\`

\`for x in ...\` は内部でこの \`next\` を \`None\` まで呼び続けている。

JS の配列メソッド \`arr.map(...).filter(...)\` に似ているが、Rust のイテレータは **遅延評価** で、途中で配列を作らない。

## iter / iter_mut / into_iter の違い

| メソッド | 取り出す要素 | 元のコレクション | 用途 |
|---|---|---|---|
| \`v.iter()\` | \`&T\`（不変参照） | そのまま使える | 読むだけ |
| \`v.iter_mut()\` | \`&mut T\`（可変参照） | そのまま（中身が変わる） | その場で書き換える |
| \`v.into_iter()\` | \`T\`（値そのもの） | **消費される**（move） | 所有権ごと取り出す |

\`\`\`rust
let mut v = vec![1, 2, 3];

for x in v.iter() { println!("{}", x); }        // x: &i32
for x in v.iter_mut() { *x *= 10; }              // x: &mut i32。* で参照外しして書き換え
println!("{:?}", v);                             // [10, 20, 30]

let names = vec![String::from("a"), String::from("b")];
for s in names.into_iter() { let owned: String = s; } // s: String
// println!("{:?}", names);  // error[E0382]: into_iter で move 済み
\`\`\`

\`for\` に渡す形でも同じ違いがある。

| 書き方 | 同じ意味 |
|---|---|
| \`for x in &v\` | \`v.iter()\` |
| \`for x in &mut v\` | \`v.iter_mut()\` |
| \`for x in v\` | \`v.into_iter()\`（v は消費される） |

## 遅延評価（lazy）

\`map\` や \`filter\` などの **アダプタ** は、呼んだだけでは **何もしない**。新しいイテレータを返すだけ。
\`collect\` や \`sum\` などの **消費者（consumer）** を呼んだときに、初めて要素が 1 つずつ流れて処理される。

\`\`\`rust
let v = vec![1, 2, 3];
v.iter().map(|x| x * 2);     // warning: unused \`Map\` that must be used（何も起きない）

let doubled: Vec<i32> = v.iter().map(|x| x * 2).collect(); // ここで初めて計算
\`\`\`

利点:
- 途中の Vec を作らないので速く、メモリも使わない
- \`take(3)\` のように **必要な分だけ** 計算できる（無限のイテレータも扱える）

\`\`\`rust
// 1, 2, 3, ... の無限列から、3 の倍数を 5 つ
let v: Vec<u32> = (1..).filter(|n| n % 3 == 0).take(5).collect(); // [3, 6, 9, 12, 15]
\`\`\`

コンパイラは最終的にこれを普通のループと同じ機械語に最適化する（ゼロコスト抽象化）。

## アダプタ（イテレータ → イテレータ）

| アダプタ | 動き | 例 → 結果 |
|---|---|---|
| \`map(f)\` | 各要素を変換 | \`[1,2,3]\` を 10 倍 → \`10, 20, 30\` |
| \`filter(p)\` | 条件を満たすものだけ | 1 より大きいものだけ → \`2, 3\` |
| \`filter_map(f)\` | 変換して \`Some\` だけ残す | \`["1","a","3"]\` を parse して成功したものだけ → \`1, 3\` |
| \`enumerate()\` | \`(番号, 要素)\` にする | \`['a','b']\` → \`(0,'a'), (1,'b')\` |
| \`zip(other)\` | 2 つを組にする（短いほうで終わる） | \`[1,2]\` と \`['a','b','c']\` → \`(1,'a'), (2,'b')\` |
| \`chain(other)\` | 後ろにつなげる | \`[1,2]\` と \`[3]\` → \`1, 2, 3\` |
| \`take(n)\` | 先頭 n 個 | \`(1..).take(3)\` → \`1, 2, 3\` |
| \`skip(n)\` | 先頭 n 個を飛ばす | \`[1,2,3,4]\` → \`skip(2)\` → \`3, 4\` |
| \`take_while(p)\` | 条件が真の間だけ | \`[1,2,5,1]\` で 3 未満の間 → \`1, 2\` |
| \`skip_while(p)\` | 条件が真の間は飛ばす | \`[1,2,5,1]\` で 3 未満の間を飛ばす → \`5, 1\` |
| \`flat_map(f)\` | 各要素をイテレータにして平らにつなぐ | \`["ab","c"]\` を文字に分解 → \`'a','b','c'\` |
| \`rev()\` | 逆順 | \`[1,2,3]\` → \`3, 2, 1\` |
| \`peekable()\` | \`peek()\` で次を「覗ける」ようにする | 後述 |
| \`cloned()\` / \`copied()\` | \`&T\` → \`T\` | \`iter().copied()\` で \`i32\` が流れる |
| \`step_by(n)\` | n 個おき | \`(0..10).step_by(3)\` → \`0, 3, 6, 9\` |

### &&x と |&x| に注意

\`v.iter()\` の要素は \`&i32\`。\`filter\` のクロージャはさらに **その参照** を受け取るので \`&&i32\` になる。

\`\`\`rust
let v = vec![1, 2, 3, 4];
let evens: Vec<&i32> = v.iter().filter(|x| **x % 2 == 0).collect();   // ** で 2 回外す
let evens: Vec<&i32> = v.iter().filter(|&&x| x % 2 == 0).collect();   // パターンで外す
let evens: Vec<i32> = v.iter().copied().filter(|x| x % 2 == 0).collect(); // 先に copied
\`\`\`

（算術演算子は参照にも実装されているので \`x % 2\` は \`&i32\` でも動くが、比較 \`x > 1\` は型を揃える必要がある）

### windows と chunks（スライスのメソッド）

\`windows\` と \`chunks\` はイテレータのアダプタではなく **スライスのメソッド** で、部分スライス \`&[T]\` を順に返すイテレータを作る。

\`\`\`rust
let v = [1, 2, 3, 4, 5];
for w in v.windows(2) { print!("{:?} ", w); } // [1, 2] [2, 3] [3, 4] [4, 5]  （重なりながらずらす）
for c in v.chunks(2) { print!("{:?} ", c); }  // [1, 2] [3, 4] [5]            （重ならずに区切る。最後は短いことも）
\`\`\`

隣同士を比べる処理は \`windows(2)\` がぴったり。

\`\`\`rust
let increases = v.windows(2).filter(|w| w[1] > w[0]).count(); // 4
\`\`\`

### peekable

\`peekable()\` を付けると、\`peek()\` で **次の要素を消費せずに覗ける**。「同じ文字が続く間まとめる」などの処理に便利。

\`\`\`rust
let mut it = "aaab".chars().peekable();
while let Some(c) = it.next() {
    let mut n = 1;
    while it.peek() == Some(&c) {  // 次も同じ文字なら
        it.next();                  // 消費して数える
        n += 1;
    }
    println!("{}{}", c, n);         // a3, b1
}
\`\`\`

## 消費者（イテレータ → 値）

| 消費者 | 結果 | 例 |
|---|---|---|
| \`collect()\` | コレクションを作る | \`Vec\`、\`String\`、\`HashMap\` など |
| \`sum()\` / \`product()\` | 合計 / 積 | \`[1,2,3]\` → \`6\` / \`6\` |
| \`count()\` | 個数 | \`usize\` |
| \`fold(初期値, f)\` | 畳み込み（JS の reduce） | 初期値 0 から足し込むと合計 |
| \`min()\` / \`max()\` | 最小 / 最大（\`Option\`。空なら None） | Ord が必要 |
| \`min_by_key\` / \`max_by_key\` | キーで比べる | 一番長い文字列を探す |
| \`any(p)\` / \`all(p)\` | どれか / 全部が条件を満たすか | \`bool\`（空なら any は false、all は true） |
| \`find(p)\` | 最初に条件を満たす要素 | \`Option<要素>\` |
| \`position(p)\` | 最初に条件を満たす位置 | \`Option<usize>\` |
| \`last()\` / \`nth(n)\` | 最後 / n 番目 | \`Option\` |
| \`for_each(f)\` | 各要素に f を実行 | \`()\` |

\`\`\`rust
let v = vec![3, 8, 1, 6];
let total: i32 = v.iter().sum();                    // 18
let product = v.iter().fold(1, |acc, x| acc * x);   // 144
let big = v.iter().any(|&x| x > 7);                 // true
let pos = v.iter().position(|&x| x == 1);           // Some(2)
let first_even = v.iter().find(|&&x| x % 2 == 0);   // Some(&8)
let max = v.iter().max();                           // Some(&8)
\`\`\`

\`sum\` は結果の型が決まらないことがあるので、\`let total: i32 = ...\` や \`sum::<i32>()\` で指定する。

## collect の型指定

\`collect\` は **何を作るか** を型で指定する。指定の仕方は 2 通り。

\`\`\`rust
let a: Vec<i32> = (1..4).collect();            // 変数の型注釈
let b = (1..4).collect::<Vec<i32>>();           // ターボフィッシュ
let c = (1..4).collect::<Vec<_>>();             // 要素の型は推論に任せる（_）

let s: String = vec!['h', 'i'].into_iter().collect();          // char → String
let words: Vec<&str> = "a b c".split(' ').collect();

use std::collections::{HashMap, HashSet};
let set: HashSet<i32> = vec![1, 1, 2].into_iter().collect();   // 重複が消える
let map: HashMap<&str, i32> = vec![("a", 1), ("b", 2)].into_iter().collect(); // タプル → Map

let r: Result<Vec<i32>, _> = ["1", "2"].iter().map(|s| s.parse::<i32>()).collect(); // Ok([1, 2])
\`\`\`

最後の例のように、\`Result\` のイテレータを \`Result<Vec<_>, _>\` に collect すると「全部成功なら Ok(Vec)、1 つでも失敗なら最初の Err」になる（27 章で詳しく）。

## まとめ

- \`Iterator\` は \`next()\` で \`Option\` を返すトレイト。\`for\` はその上に作られている
- \`iter\`（&T）/ \`iter_mut\`（&mut T）/ \`into_iter\`（T、消費する）を使い分ける
- アダプタは遅延評価。消費者を呼んで初めて動く
- \`collect\` は作りたいコレクションの型を注釈かターボフィッシュで指定する`,
    hints: [
      "iter は &T、iter_mut は &mut T、into_iter は T（元を消費）を取り出す。",
      "map / filter などのアダプタは遅延評価。collect や sum を呼ぶまで動かない。",
      "collect は `let v: Vec<_> = ...` か `collect::<Vec<_>>()` で型を指定する。",
      "windows(2) で隣同士を比べる、peekable で次を覗く。",
    ],
  },
  learn: {
    quiz: [
      {
        prompt: "次のコードを実行すると何が出力される？",
        snippet: `let v = vec![1, 2, 3];
v.iter().map(|x| {
    println!("{}", x);
    x * 2
});
`,
        choices: ["何も出力されない（警告が出る）", "1 2 3", "2 4 6", "コンパイルエラー"],
        answer: "何も出力されない（警告が出る）",
        explain:
          "map は遅延評価で、消費者（collect や for など）を呼ばない限りクロージャは実行されない。",
      },
      {
        prompt: "`v.into_iter()` の後、`v` について正しいのは？",
        choices: [
          "v は消費されて使えない",
          "v はそのまま使える",
          "v は空になるが使える",
          "v の要素がコピーされる",
        ],
        answer: "v は消費されて使えない",
        explain: "into_iter は要素の所有権ごと取り出すので、元の Vec は move される。",
      },
      {
        prompt: "Vec の要素をその場で 2 倍にするのに使うのは？",
        choices: ["iter_mut()", "iter()", "into_iter()", "windows(2)"],
        answer: "iter_mut()",
        explain:
          "iter_mut は &mut T を返すので `for x in v.iter_mut() { *x *= 2; }` と書き換えられる。",
      },
      {
        prompt: "`[1, 2, 3, 4].windows(2).count()` の値は？",
        choices: ["3", "2", "4", "1"],
        answer: "3",
        explain: "windows(2) は [1,2] [2,3] [3,4] の 3 つ。chunks(2) なら [1,2] [3,4] の 2 つ。",
      },
      {
        prompt: "`vec![1, 2, 3].iter().fold(10, |acc, x| acc + x)` の値は？",
        choices: ["16", "6", "10", "13"],
        answer: "16",
        explain: "初期値 10 に 1, 2, 3 を順に足す。",
      },
      {
        prompt:
          '`["1", "x", "3"].iter().filter_map(|s| s.parse::<i32>().ok()).collect::<Vec<_>>()` の結果は？',
        choices: ["[1, 3]", "[1, 0, 3]", "Err(...)", "[Some(1), None, Some(3)]"],
        answer: "[1, 3]",
        explain: "filter_map はクロージャが Some を返した要素だけ中身を残す。",
      },
      {
        prompt: "`let x = (1..4).collect();` だけだとエラーになる理由は？",
        choices: [
          "何のコレクションを作るか型が分からないから",
          "範囲は collect できないから",
          "collect には引数が必要だから",
          "mut が必要だから",
        ],
        answer: "何のコレクションを作るか型が分からないから",
        explain:
          "collect は Vec にも HashSet にも String にもなれる。`let x: Vec<i32>` か `collect::<Vec<_>>()` で指定する。",
      },
      {
        prompt: "`vec![1, 2].iter().zip(vec!['a', 'b', 'c'].iter()).count()` の値は？",
        choices: ["2", "3", "5", "6"],
        answer: "2",
        explain: "zip は短いほうが終わった時点で終わる。",
      },
    ],
  },
});
