import { defineProblem } from "../../../core/schemas";

export default defineProblem({
  id: "rust-learn-std-utilities",
  stage: "learn",
  language: "rust",
  scenario: "rust",
  copy: {
    title: "標準ライブラリの便利機能（ソート・ヒープ・Ordering・mem・time）",
    prompt: `## ソート

\`\`\`rust
let mut v = vec![5, 2, 9, 1];
v.sort();                          // 昇順 [1, 2, 5, 9]（安定ソート）
v.sort_by(|a, b| b.cmp(a));        // 降順 [9, 5, 2, 1]
v.reverse();                       // 逆順にする

let mut words = vec!["banana", "fig", "apple"];
words.sort_by_key(|w| w.len());    // 長さ順 ["fig", "apple", "banana"]（同じ長さは元の順を保つ）
v.sort_unstable();                 // 不安定ソート（同じ値の順番は保証しないが速い）
\`\`\`

| メソッド | 用途 |
|---|---|
| \`sort()\` | \`Ord\` を実装した型を昇順に |
| \`sort_by(比較関数)\` | 比較関数を自分で書く（\`Ordering\` を返す） |
| \`sort_by_key(キー関数)\` | キーを取り出して、その順に並べる |
| \`sort_unstable*()\` | 安定性が要らないとき。追加メモリなしで速い |
| \`is_sorted()\` | ソート済みか確認 |

### f64 はそのままではソートできない

\`\`\`rust
let mut f = vec![2.5, -1.0, 3.7];
// f.sort();                              // E0277: f64 は Ord を実装していない（NaN があるため）
f.sort_by(|a, b| a.partial_cmp(b).unwrap()); // NaN がなければこれで OK
f.sort_by(|a, b| a.total_cmp(b));             // NaN も含めて全順序で比べる（おすすめ）
\`\`\`

\`NaN\` は「どの値とも大小比較できない」ので、\`f64\` は \`PartialOrd\` だけで \`Ord\` を持たない。\`total_cmp\` は IEEE の全順序で比べるので安全。

## 二分探索 binary_search

**ソート済み** のスライスから値を探す。O(log n) で速い。

\`\`\`rust
let v = vec![1, 3, 5, 7, 9];
assert_eq!(v.binary_search(&7), Ok(3));   // 見つかった → Ok(位置)
assert_eq!(v.binary_search(&4), Err(2));  // 見つからない → Err(挿入すべき位置)

// ソート順を保ったまま挿入する定番パターン
let mut v = vec![1, 3, 5];
let pos = v.binary_search(&4).unwrap_or_else(|e| e);
v.insert(pos, 4);                          // [1, 3, 4, 5]
\`\`\`

- \`Err(i)\` の \`i\` は「ここに入れればソート順が保たれる位置」。挿入位置の計算に使える
- 同じ値が複数あるとき、どれの位置が返るかは決まっていない
- \`binary_search_by_key(&キー, |x| キー)\` や \`binary_search_by(|x| x.cmp(&target))\` もある
- \`partition_point(|x| *x < 5)\` は「条件を満たす最初の位置」（lower_bound 相当）

## std::cmp::Ordering と cmp / then_with

比較の結果は \`Ordering\` という enum。

\`\`\`rust
use std::cmp::Ordering;

match 3.cmp(&5) {
    Ordering::Less => println!("小さい"),
    Ordering::Equal => println!("同じ"),
    Ordering::Greater => println!("大きい"),
}
\`\`\`

複数の条件で並べるときは \`then_with\` / \`then\` でつなぐ。

\`\`\`rust
#[derive(Debug)]
struct Student { name: String, score: u32, age: u32 }

let mut list = vec![/* ... */];
list.sort_by(|a, b| {
    b.score.cmp(&a.score)                  // 1. 点数の高い順（b と a を逆にすると降順）
        .then_with(|| a.age.cmp(&b.age))   // 2. 同点なら年齢の若い順
        .then_with(|| a.name.cmp(&b.name)) // 3. それも同じなら名前順
});
\`\`\`

| メソッド | 意味 |
|---|---|
| \`a.cmp(&b)\` | \`Ord\` 型の比較 |
| \`a.partial_cmp(&b)\` | \`PartialOrd\` 型の比較（\`Option<Ordering>\`） |
| \`ord.reverse()\` | 逆にする（\`Less\` ⇔ \`Greater\`） |
| \`ord.then(other)\` | \`Equal\` のときだけ \`other\` を使う |
| \`ord.then_with(クロージャ)\` | \`Equal\` のときだけクロージャを評価（遅延） |
| \`ord.is_lt()\` / \`is_eq()\` / \`is_gt()\` | 判定 |

タプルは辞書順で比較できるので、\`sort_by_key(|s| (Reverse(s.score), s.age))\` のようにも書ける。

## min / max / min_by_key / max_by_key

\`\`\`rust
use std::cmp::{max, min};

let a = max(3, 7);                   // 7
let b = 10.clamp(0, 5);              // 5（範囲に収める）

let words = vec!["pear", "fig", "banana"];
let longest = words.iter().max_by_key(|w| w.len());  // Some("banana")
let shortest = words.iter().min_by_key(|w| w.len()); // Some("fig")

let nums = [2.5, 9.1, -3.0];
let biggest = nums.iter().copied().max_by(|a, b| a.total_cmp(b)); // Some(9.1)
let empty: Vec<i32> = vec![];
assert_eq!(empty.iter().max(), None); // 空なら None
\`\`\`

- 戻り値は \`Option\`（空のときは \`None\`）
- **同じ最大値が複数あるとき、\`max_by_key\` は最後の要素、\`min_by_key\` は最初の要素を返す**
- \`f64\` には \`max()\` / \`min()\` が使えない（\`Ord\` でないため）。\`max_by(|a, b| a.total_cmp(b))\` か \`f64::max\` で畳み込む

## BinaryHeap: 優先度付きキュー

\`std::collections::BinaryHeap\` は **常に最大の要素をすぐ取り出せる** コレクション。

\`\`\`rust
use std::collections::BinaryHeap;
use std::cmp::Reverse;

let mut heap = BinaryHeap::new();
heap.push(3);
heap.push(8);
heap.push(1);
assert_eq!(heap.peek(), Some(&8)); // 最大を見る
assert_eq!(heap.pop(), Some(8));   // 最大を取り出す
assert_eq!(heap.pop(), Some(3));

// 最小ヒープにしたいときは Reverse で包む
let mut min_heap = BinaryHeap::new();
min_heap.push(Reverse(5));
min_heap.push(Reverse(2));
min_heap.push(Reverse(9));
assert_eq!(min_heap.pop(), Some(Reverse(2)));
if let Some(Reverse(x)) = min_heap.pop() {
    println!("{x}"); // 5
}
\`\`\`

| 操作 | 計算量 |
|---|---|
| \`push\` | O(log n) |
| \`pop\`（最大を取り出す） | O(log n) |
| \`peek\`（最大を見る） | O(1) |
| \`into_sorted_vec()\` | 昇順の Vec にする |

- 「上位 K 件」「次に処理すべきタスク」「ダイクストラ法」などで使う
- \`(優先度, 名前)\` のようなタプルを入れると、優先度 → 名前の順で比べられる
- \`Reverse\` は比較を逆にするラッパー。\`sort_by_key(|x| Reverse(*x))\` で降順ソートにも使える

## std::mem::swap / replace / take

\`&mut\` 参照しか持っていないとき、中身を **移動** で取り出したり入れ替えたりするための関数。

\`\`\`rust
use std::mem;

let mut a = String::from("A");
let mut b = String::from("B");
mem::swap(&mut a, &mut b);               // a = "B", b = "A"

let mut name = String::from("old");
let old = mem::replace(&mut name, String::from("new")); // old = "old", name = "new"

let mut list = vec![1, 2, 3];
let taken = mem::take(&mut list);        // taken = [1, 2, 3], list = []（Default の値が残る）
\`\`\`

なぜ必要なのか。\`&mut self\` のメソッドでフィールドの中身を返したいとき、そのまま \`self.items\` を返すと「借用の中から move できない（E0507）」エラーになる。\`mem::take\` なら **代わりの空の値を置いて** 中身を持ち出せる。

\`\`\`rust
struct Buffer { items: Vec<String> }

impl Buffer {
    fn flush(&mut self) -> Vec<String> {
        // self.items        // E0507: 借用している self から move できない
        std::mem::take(&mut self.items) // 中身を取り出し、空の Vec を残す
    }
}
\`\`\`

\`Option\` の場合は \`opt.take()\`（\`mem::take\` と同じで \`None\` を残す）や \`opt.replace(v)\` が便利。

## 数値の文字列フォーマットと変換

\`\`\`rust
let n = 1234567;
println!("{:>10}", n);       // 右寄せ
println!("{:08.3}", 3.14159); // 0003.142
println!("{:e}", 1500.0);     // 1.5e3

// 文字列 → 数値
let x: i32 = "42".parse().unwrap();
let y = "3.5".parse::<f64>();          // Ok(3.5)
let z = "abc".parse::<i32>();          // Err(ParseIntError)
let h = i64::from_str_radix("ff", 16); // Ok(255)

// 数値 → 文字列
let s = 255.to_string();               // "255"
let hex = format!("{:x}", 255);        // "ff"
\`\`\`

桁区切り（\`1,234,567\`）は標準の書式にはないので、自分で書く必要がある（よくある練習問題）。

## 時間: std::time

| 型 | 用途 |
|---|---|
| \`Duration\` | 時間の長さ（5 秒、200 ミリ秒など） |
| \`Instant\` | 経過時間の計測用の時刻（単調増加、時計の変更に影響されない） |
| \`SystemTime\` | 現在の日時（壁時計）。\`UNIX_EPOCH\` からの経過時間など |

\`\`\`rust
use std::time::{Duration, Instant, SystemTime, UNIX_EPOCH};

let d = Duration::from_secs(90) + Duration::from_millis(500);
println!("{}", d.as_secs());       // 90
println!("{}", d.as_millis());     // 90500
println!("{:?}", d);               // 90.5s

let start = Instant::now();
// ... 何か重い処理 ...
let elapsed = start.elapsed();     // Duration
println!("{:?} かかった", elapsed);

let now = SystemTime::now();
let unix = now.duration_since(UNIX_EPOCH).unwrap().as_secs(); // UNIX 時刻（秒）
std::thread::sleep(Duration::from_millis(10)); // 待つ
\`\`\`

- ベンチマークや経過時間には \`Instant\`、日時の記録には \`SystemTime\`
- 年月日やタイムゾーンを扱う機能は標準にはない（\`chrono\` や \`time\` クレートを使う）

## まとめ

- \`sort\` / \`sort_by\` / \`sort_by_key\`、\`f64\` は \`total_cmp\`
- \`binary_search\` は \`Ok(位置)\` / \`Err(挿入位置)\`
- 複数条件の比較は \`cmp\` を \`then_with\` でつなぐ。降順は \`b.cmp(a)\` か \`Reverse\`
- \`BinaryHeap\` は最大ヒープ、\`Reverse\` で最小ヒープ
- \`&mut\` から中身を取り出すのは \`mem::take\` / \`mem::replace\`、入れ替えは \`mem::swap\`
- 時間の長さは \`Duration\`、計測は \`Instant\``,
    hints: [
      "`binary_search` はソート済みが前提。見つかれば `Ok(位置)`、なければ `Err(挿入位置)`。",
      "複数キーの並べ替えは `a.x.cmp(&b.x).then_with(|| ...)`。降順は `b.cmp(a)` か `Reverse`。",
      "`BinaryHeap` は最大ヒープ。最小を取り出したいなら `Reverse` で包む。",
      "`mem::take` / `mem::replace` で `&mut` の中身を代わりの値と入れ替えて取り出せる。",
    ],
  },
  learn: {
    quiz: [
      {
        prompt: "`vec![1, 3, 5, 7].binary_search(&4)` の結果は？",
        choices: ["Err(2)", "Ok(2)", "None", "Err(-1)"],
        answer: "Err(2)",
        explain: "見つからないときは、ソート順を保ったまま挿入できる位置を Err で返す。",
      },
      {
        prompt: "`vec![2.5, 1.0].sort()` がコンパイルエラーになる理由は？",
        choices: [
          "f64 は NaN があるため Ord を実装していない",
          "Vec<f64> はソートできない",
          "sort は整数専用",
          "mut が付いていない",
        ],
        answer: "f64 は NaN があるため Ord を実装していない",
        explain: "f64 は PartialOrd だけ。`sort_by(|a, b| a.total_cmp(b))` を使う。",
      },
      {
        prompt: "点数の高い順、同点なら名前の昇順に並べる比較関数は？",
        choices: [
          "b.score.cmp(&a.score).then_with(|| a.name.cmp(&b.name))",
          "a.score.cmp(&b.score).then_with(|| a.name.cmp(&b.name))",
          "b.score.cmp(&a.score).then_with(|| b.name.cmp(&a.name))",
          "a.name.cmp(&b.name).then_with(|| b.score.cmp(&a.score))",
        ],
        answer: "b.score.cmp(&a.score).then_with(|| a.name.cmp(&b.name))",
        explain:
          "降順は b と a を逆にして比べる。then_with は前の比較が Equal のときだけ使われる。",
      },
      {
        prompt: "BinaryHeap に 3, 8, 1 を push して pop すると最初に出てくるのは？",
        choices: ["8", "1", "3", "None"],
        answer: "8",
        explain: "BinaryHeap は最大ヒープ。最小を出したいなら Reverse で包む。",
      },
      {
        prompt: "次のコードの後の `list` の中身は？",
        snippet: `let mut list = vec![1, 2, 3];
let taken = std::mem::take(&mut list);`,
        choices: ["[]", "[1, 2, 3]", "コンパイルエラー", "未初期化"],
        answer: "[]",
        explain: "mem::take は中身を取り出し、代わりに Default の値（空の Vec）を残す。",
      },
      {
        prompt: '`["pear", "fig", "kiwi"].iter().max_by_key(|w| w.len())` の結果は？',
        choices: ['Some("kiwi")', 'Some("pear")', 'Some("fig")', "None"],
        answer: 'Some("kiwi")',
        explain: "長さ 4 が 2 つあるとき、max_by_key は最後の要素を返す。",
      },
      {
        prompt: "処理にかかった時間を測るのに適した型は？",
        choices: ["Instant", "SystemTime", "Duration だけ", "UNIX_EPOCH"],
        answer: "Instant",
        explain:
          "Instant は単調増加する時刻で、時計の変更に影響されない。`start.elapsed()` で Duration が得られる。",
      },
    ],
  },
});
