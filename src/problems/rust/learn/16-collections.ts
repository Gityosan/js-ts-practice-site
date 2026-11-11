import { defineProblem } from "../../../core/schemas";

export default defineProblem({
  id: "rust-learn-collections",
  stage: "learn",
  language: "rust",
  scenario: "rust",
  copy: {
    title: "HashMap / HashSet / BTreeMap / VecDeque",
    prompt: `## 標準ライブラリのコレクション

Vec 以外にも、\`std::collections\` に用途別のコレクションがある。どれも **use してから** 使う（Vec と違って prelude に入っていない）。

\`\`\`rust
use std::collections::{BTreeMap, BTreeSet, HashMap, HashSet, VecDeque};
\`\`\`

| 型 | 中身 | 順序 | 主な用途 | JS で近いもの |
|---|---|---|---|---|
| \`HashMap<K, V>\` | キー → 値 | **不定** | 辞書・集計（速い） | \`Map\` / オブジェクト |
| \`BTreeMap<K, V>\` | キー → 値 | **キーの昇順** | 順序付きの辞書 | （なし） |
| \`HashSet<T>\` | 重複なしの集合 | 不定 | 重複除去・所属判定 | \`Set\` |
| \`BTreeSet<T>\` | 重複なしの集合 | 昇順 | 順序付き集合 | （なし） |
| \`VecDeque<T>\` | 両端キュー | 入れた順 | キュー（先頭からも速く取り出す） | 配列の shift/push |

## HashMap の基本

\`\`\`rust
use std::collections::HashMap;

let mut scores: HashMap<String, i32> = HashMap::new();
scores.insert(String::from("Blue"), 10);
scores.insert(String::from("Red"), 50);
scores.insert(String::from("Blue"), 25);   // 同じキーは上書き（古い値 Some(10) が返る）

let s: Option<&i32> = scores.get("Blue");   // Some(&25)
let n = scores.get("Green").copied().unwrap_or(0); // 0
scores.contains_key("Red");                 // true
scores.remove("Red");                       // Some(50)
scores.len();                               // 1

for (name, score) in &scores {              // (&String, &i32)
    println!("{name}: {score}");
}
\`\`\`

- キーの型は \`Eq\` と \`Hash\` を実装していればよい（整数・String・&str・char・タプルなど。**f64 は不可**）
- \`get\` は **Option** を返す（キーがなくても panic しない）。\`scores["Blue"]\` の添字も書けるが、ないと panic
- 配列から作る: \`HashMap::from([("a", 1), ("b", 2)])\`、イテレータから: \`.collect::<HashMap<_, _>>()\`

## entry API — 「なければ入れる」を 1 回で

集計で一番よく使う書き方。

\`\`\`rust
let text = "the cat the dog the end";
let mut counts: HashMap<&str, u32> = HashMap::new();
for word in text.split_whitespace() {
    *counts.entry(word).or_insert(0) += 1;
}
// {"the": 3, "cat": 1, "dog": 1, "end": 1}（表示順は不定）
\`\`\`

- \`entry(key)\` でそのキーの「場所」を取り、\`or_insert(初期値)\` で **なければ初期値を入れて**、値への \`&mut V\` を返す
- \`*\` で参照外しして \`+= 1\`
- \`or_default()\` は型の既定値（数値は 0、String は空、Vec は空）を入れる: \`*counts.entry(w).or_default() += 1;\`
- \`or_insert_with(|| 重い計算)\` はなかったときだけ計算する
- 値が Vec なら \`map.entry(k).or_default().push(x);\` でグループ分けができる
- \`and_modify(|v| *v += 1).or_insert(1)\` という書き方もある

JS で \`counts[w] = (counts[w] || 0) + 1\` と書いていたものに相当する。

## HashMap と所有権

\`\`\`rust
let key = String::from("color");
let value = String::from("blue");
let mut map = HashMap::new();
map.insert(key, value);
// println!("{key}");   // エラー: key は map にムーブされた
\`\`\`

- \`String\` のような所有権を持つ値は、insert すると **map にムーブ** される
- \`i32\` など Copy 型はコピーされる
- 参照（\`&str\` など）を入れることもできるが、その参照先が map より長生きする必要がある
- \`get\` が返すのは \`&V\`（借用）。所有権が欲しいなら \`remove\` で取り出すか \`clone\`

## 反復順序は不定

HashMap / HashSet の \`for\` や \`{:?}\` の順序は **決まっていない**。同じプログラムでも実行のたびに変わることがある（ハッシュに乱数の種を使って、悪意ある入力による性能攻撃 HashDoS を防いでいるため）。

\`\`\`rust
let m = HashMap::from([(1, 'a'), (2, 'b'), (3, 'c')]);
println!("{m:?}");   // {2: 'b', 3: 'c', 1: 'a'} かもしれないし別の順かもしれない
\`\`\`

順序が必要なら:

- **BTreeMap / BTreeSet を使う**（常にキーの昇順）
- または取り出してから並べる: \`let mut v: Vec<_> = m.into_iter().collect(); v.sort();\`

テストで結果を比べるときも、HashMap のまま比べず、ソートした Vec や BTreeMap に変換する。

## BTreeMap — キー順に並ぶ辞書

API は HashMap とほぼ同じ。内部が平衡木（B 木）なので常にキーの昇順で取り出せる。

\`\`\`rust
use std::collections::BTreeMap;

let mut m = BTreeMap::new();
m.insert("banana", 3);
m.insert("apple", 5);
m.insert("cherry", 1);
println!("{m:?}");                 // {"apple": 5, "banana": 3, "cherry": 1}（必ずこの順）

m.first_key_value();               // Some((&"apple", &5))
m.last_key_value();                // Some((&"cherry", &1))
for (k, v) in m.range("b".."c") {  // キーの範囲で取り出す
    println!("{k} {v}");           // banana 3
}
\`\`\`

| | HashMap | BTreeMap |
|---|---|---|
| 検索・挿入 | 平均 O(1) | O(log n) |
| 順序 | 不定 | キーの昇順 |
| キーの条件 | \`Eq + Hash\` | \`Ord\` |

## HashSet — 重複なしの集合

\`\`\`rust
use std::collections::HashSet;

let mut s = HashSet::new();
s.insert(3);       // true（新しく入った）
s.insert(3);       // false（もうあった）
s.contains(&3);    // true
s.remove(&3);

let a: HashSet<i32> = [1, 2, 3, 4].into_iter().collect();
let b: HashSet<i32> = [3, 4, 5].into_iter().collect();

a.intersection(&b);           // 積集合（共通）  {3, 4}
a.union(&b);                  // 和集合          {1, 2, 3, 4, 5}
a.difference(&b);             // 差集合（a だけ）{1, 2}
a.symmetric_difference(&b);   // 対称差          {1, 2, 5}
a.is_subset(&b);              // false
\`\`\`

- 集合演算は **イテレータ（要素は \`&T\`）** を返す。Vec にするなら \`.copied().collect::<Vec<_>>()\` などしてから \`sort\`
- Vec の重複除去にも使える: \`v.into_iter().collect::<HashSet<_>>()\`（順序は失われる）
- 順序付きにしたいなら \`BTreeSet\`（集合演算の結果も昇順）

## VecDeque — 両端キュー

Vec の \`remove(0)\` は全要素をずらすので遅い（O(n)）。先頭からの出し入れが多いなら **VecDeque**（リングバッファ）を使う。

\`\`\`rust
use std::collections::VecDeque;

let mut q: VecDeque<i32> = VecDeque::new();
q.push_back(1);        // 末尾に追加   [1]
q.push_back(2);        //              [1, 2]
q.push_front(0);       // 先頭に追加   [0, 1, 2]
q.pop_front();         // Some(0)      [1, 2]
q.pop_back();          // Some(2)      [1]
q.front();             // Some(&1)  先頭を見るだけ
q.back();              // Some(&1)
q.len();
q.rotate_left(1);      // 回転
let v: Vec<i32> = q.into_iter().collect();
\`\`\`

- \`push_back\` + \`pop_front\` で **FIFO（先入れ先出し）キュー**。幅優先探索（BFS）やタスク待ち行列の定番
- \`push_back\` + \`pop_back\` ならスタックとしても使える
- 添字 \`q[0]\` や \`q.get(i)\` もできる

## どれを使う？

- 順番に並べて持つ → **Vec**
- 先頭からも取り出す（キュー） → **VecDeque**
- キーで値を引く → **HashMap**（順序が要るなら **BTreeMap**）
- 重複を除く・含まれるか調べる・集合演算 → **HashSet**（順序が要るなら **BTreeSet**）`,
    hints: [
      "コレクションは `use std::collections::...` が必要。`get` は Option を返す。",
      "集計は `*map.entry(k).or_insert(0) += 1`（`or_default()` も可）。",
      "HashMap / HashSet の順序は不定。順序が要るなら BTreeMap / BTreeSet か、ソートした Vec に変換。",
      "VecDeque は `push_back` / `pop_front` でキューになる。",
    ],
  },
  learn: {
    quiz: [
      {
        prompt: '`map.insert("a", 1); map.insert("a", 2);` の後、`map.get("a")` は？',
        choices: ["Some(&2)", "Some(&1)", "Some(&3)", "None"],
        answer: "Some(&2)",
        explain: "同じキーへの insert は上書き。2 回目の insert は古い値 Some(1) を返す。",
      },
      {
        prompt: "単語の出現回数を数える定番の書き方は？",
        choices: [
          "*counts.entry(w).or_insert(0) += 1;",
          "counts[w] += 1;",
          "counts.get(w) += 1;",
          "counts.insert(w, +1);",
        ],
        answer: "*counts.entry(w).or_insert(0) += 1;",
        explain: "entry で場所を取り、なければ 0 を入れ、返ってきた &mut の中身を増やす。",
      },
      {
        prompt: "HashMap を `{:?}` で表示したときの順序は？",
        choices: ["決まっていない（実行ごとに変わりうる）", "挿入した順", "キーの昇順", "値の昇順"],
        answer: "決まっていない（実行ごとに変わりうる）",
        explain: "ハッシュの種がランダムなので順序は不定。順序が要るなら BTreeMap。",
      },
      {
        prompt: '`let k = String::from("x"); map.insert(k, 1);` の後に k を使うと？',
        choices: [
          "コンパイルエラー（k は map にムーブされた）",
          "普通に使える",
          "空文字列になる",
          "map から削除される",
        ],
        answer: "コンパイルエラー（k は map にムーブされた）",
        explain: "String は Copy でないので insert でムーブされる。必要なら clone して入れる。",
      },
      {
        prompt: "キーの昇順で取り出せる辞書は？",
        choices: ["BTreeMap", "HashMap", "HashSet", "VecDeque"],
        answer: "BTreeMap",
        explain: "BTreeMap は平衡木で、常にキーの昇順に並ぶ。キーには Ord が必要。",
      },
      {
        prompt: "a = {1, 2, 3}, b = {2, 3, 4} のとき `a.difference(&b)` の要素は？",
        choices: ["1", "4", "1 と 4", "2 と 3"],
        answer: "1",
        explain:
          "差集合は「a にあって b にないもの」。両方の片側だけなら symmetric_difference（1 と 4）。",
      },
      {
        prompt: "先入れ先出し（FIFO）のキューとして VecDeque を使う組み合わせは？",
        choices: [
          "push_back と pop_front",
          "push_back と pop_back",
          "push_front と pop_front",
          "insert と remove",
        ],
        answer: "push_back と pop_front",
        explain:
          "末尾に入れて先頭から出すと、入れた順に取り出せる。push_back + pop_back はスタック。",
      },
      {
        prompt: "Vec の先頭要素を何度も取り除くと遅い理由は？",
        choices: [
          "remove(0) のたびに残り全要素を前にずらすから（O(n)）",
          "Vec はヒープにないから",
          "先頭は読み取り専用だから",
          "remove が毎回 clone するから",
        ],
        answer: "remove(0) のたびに残り全要素を前にずらすから（O(n)）",
        explain: "VecDeque なら pop_front は O(1)。",
      },
    ],
  },
});
