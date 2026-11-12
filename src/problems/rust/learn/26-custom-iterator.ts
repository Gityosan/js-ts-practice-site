import { defineProblem } from "../../../core/schemas";

export default defineProblem({
  id: "rust-learn-custom-iterator",
  stage: "learn",
  language: "rust",
  scenario: "rust",
  copy: {
    title: "Iterator を自作する",
    prompt: `## next を 1 つ書くだけ

自作の型をイテレータにするには、\`Iterator\` トレイトを実装する。必要なのは **関連型 \`Item\`** と **\`next\` メソッド** の 2 つだけ。

\`\`\`rust
struct Counter {
    count: u32,
    max: u32,
}

impl Counter {
    fn new(max: u32) -> Counter {
        Counter { count: 0, max }
    }
}

impl Iterator for Counter {
    type Item = u32;                       // このイテレータが返す要素の型

    fn next(&mut self) -> Option<u32> {    // Option<Self::Item> と書いても同じ
        if self.count < self.max {
            self.count += 1;
            Some(self.count)               // 次の要素
        } else {
            None                           // 終わり
        }
    }
}
\`\`\`

- \`next\` は \`&mut self\` を取る。イテレータは **自分の状態（今どこまで進んだか）を書き換えながら** 要素を返すから
- 終わったら \`None\` を返す。\`None\` の後にまた呼ばれたら、普通はまた \`None\` を返す

### next さえ書けば、全部のアダプタが使える

\`map\`、\`filter\`、\`sum\`、\`collect\`、\`zip\`… は \`Iterator\` トレイトの **デフォルト実装** なので、自作のイテレータでもそのまま使える。

\`\`\`rust
let total: u32 = Counter::new(5).sum();                   // 15
let v: Vec<u32> = Counter::new(3).collect();              // [1, 2, 3]
let evens: Vec<u32> = Counter::new(10).filter(|x| x % 2 == 0).collect(); // [2, 4, 6, 8, 10]

let s: u32 = Counter::new(5)
    .zip(Counter::new(5).skip(1))   // (1,2), (2,3), (3,4), (4,5)
    .map(|(a, b)| a * b)
    .sum();                         // 2 + 6 + 12 + 20 = 40
\`\`\`

## 関連型 Item とは

\`type Item = u32;\` は **関連型（associated type）**。トレイトの中で「実装する側が決める型」を表す。

なぜジェネリクス（\`Iterator<T>\`）にしないのか？ ジェネリクスだと「Counter は \`Iterator<u32>\` でもあり \`Iterator<String>\` でもある」と複数実装できてしまい、\`next\` を呼ぶたびに型を指定する必要が出る。
**1 つの型につき要素の型は 1 つに決まる** ので、関連型のほうが自然で、使う側も \`Iterator<Item = u32>\` と書くだけで済む。

\`\`\`rust
fn sum_all(it: impl Iterator<Item = u32>) -> u32 {
    it.sum()
}
sum_all(Counter::new(4)); // 10
\`\`\`

## 自作の型を for で回す

\`for x in 値\` は、\`値\` に対して \`IntoIterator::into_iter\` を呼び、得られたイテレータの \`next\` を回す。

\`\`\`rust
// for x in expr { body } は、だいたい次と同じ
let mut it = IntoIterator::into_iter(expr);
while let Some(x) = it.next() {
    body
}
\`\`\`

すべての \`Iterator\` は \`IntoIterator\` も自動で実装している（自分自身を返す）ので、イテレータはそのまま \`for\` に渡せる。

\`\`\`rust
for n in Counter::new(3) {
    println!("{}", n); // 1 2 3
}
\`\`\`

## IntoIterator を実装する

「イテレータそのものではないが、for で回したい型」（コレクションなど）には \`IntoIterator\` を実装する。

\`\`\`rust
trait IntoIterator {
    type Item;                                   // 要素の型
    type IntoIter: Iterator<Item = Self::Item>;  // 返すイテレータの型
    fn into_iter(self) -> Self::IntoIter;
}
\`\`\`

### 値で回す（所有権ごと）

\`\`\`rust
struct Countdown(u32);

struct CountdownIter {
    n: u32,
}

impl Iterator for CountdownIter {
    type Item = u32;
    fn next(&mut self) -> Option<u32> {
        if self.n == 0 {
            None
        } else {
            self.n -= 1;
            Some(self.n + 1)
        }
    }
}

impl IntoIterator for Countdown {
    type Item = u32;
    type IntoIter = CountdownIter;
    fn into_iter(self) -> CountdownIter {
        CountdownIter { n: self.0 }
    }
}

for n in Countdown(3) {
    print!("{} ", n); // 3 2 1
}
\`\`\`

### 参照で回す（&コレクション）

中身の Vec を借用して回したいときは、\`&'a 型\` に対して実装し、Vec のイテレータ（\`std::slice::Iter\`）をそのまま返すのが簡単。

\`\`\`rust
struct Playlist {
    songs: Vec<String>,
}

impl<'a> IntoIterator for &'a Playlist {
    type Item = &'a String;
    type IntoIter = std::slice::Iter<'a, String>;
    fn into_iter(self) -> Self::IntoIter {
        self.songs.iter()
    }
}

let p = Playlist { songs: vec!["a".into(), "b".into()] };
for s in &p {            // &Playlist に対する IntoIterator
    println!("{}", s);
}
println!("{}", p.songs.len()); // 借用しただけなので p はまだ使える
\`\`\`

標準ライブラリの \`Vec\` も同じように、\`Vec<T>\`（値）、\`&Vec<T>\`、\`&mut Vec<T>\` の 3 つに \`IntoIterator\` を実装している。だから \`for x in v\` / \`for x in &v\` / \`for x in &mut v\` が使い分けられる。

## 無限イテレータと take

\`next\` が **決して \`None\` を返さない** イテレータも作れる。遅延評価なので、\`take\` や \`take_while\` で必要な分だけ取り出せば問題ない。

\`\`\`rust
struct Fibonacci {
    a: u64,
    b: u64,
}

impl Iterator for Fibonacci {
    type Item = u64;
    fn next(&mut self) -> Option<u64> {
        let r = self.a;
        self.a = self.b;
        self.b = r + self.b;
        Some(r)              // ずっと Some
    }
}

let fib = Fibonacci { a: 0, b: 1 };
let first10: Vec<u64> = fib.take(10).collect(); // [0, 1, 1, 2, 3, 5, 8, 13, 21, 34]

let fib = Fibonacci { a: 0, b: 1 };
let under100: Vec<u64> = fib.take_while(|&x| x < 100).collect();
\`\`\`

**注意**: 無限イテレータに \`collect\` や \`sum\`、\`count\` をそのまま呼ぶと **終わらない**（またはオーバーフローで panic）。必ず \`take\` などで区切る。

標準ライブラリにも無限イテレータがある。

| 書き方 | 内容 |
|---|---|
| \`(1..)\` | 1, 2, 3, ... |
| \`std::iter::repeat(x)\` | x, x, x, ... |
| \`v.iter().cycle()\` | v の要素を繰り返す |
| \`std::iter::successors(Some(1), f)\` | 前の値から次の値を計算し続ける（f が None で終わる） |
| \`std::iter::from_fn(f)\` | クロージャ f を呼ぶたびに次の要素（None で終わる） |

構造体を作るほどでもないときは \`from_fn\` / \`successors\` が手軽。

\`\`\`rust
let powers: Vec<u32> = std::iter::successors(Some(1u32), |&x| Some(x * 2)).take(5).collect();
// [1, 2, 4, 8, 16]

let mut n = 0;
let squares: Vec<u32> = std::iter::from_fn(|| { n += 1; Some(n * n) }).take(4).collect();
// [1, 4, 9, 16]
\`\`\`

## まとめ

- \`impl Iterator for 型 { type Item = ...; fn next(&mut self) -> Option<Self::Item> }\`
- next を書けば map / filter / sum / collect などは全部タダで使える
- for で回したいコレクション型には \`IntoIterator\` を実装（値で回す版と \`&型\` で回す版）
- None を返さない無限イテレータは \`take\` / \`take_while\` で区切って使う`,
    hints: [
      "Iterator の実装に必要なのは `type Item` と `fn next(&mut self) -> Option<Self::Item>` だけ。",
      "next を実装すれば map / filter / sum などのメソッドが全部使える。",
      "for で回すには IntoIterator。&型 に実装すれば借用で回せる。",
      "無限イテレータは take / take_while で区切ってから消費する。",
    ],
  },
  learn: {
    quiz: [
      {
        prompt: "Iterator トレイトを実装するとき、必ず書かなければならないものは？",
        choices: [
          "type Item と fn next",
          "fn next と fn map",
          "fn iter と fn collect",
          "type Item だけ",
        ],
        answer: "type Item と fn next",
        explain: "map や collect などはデフォルト実装されている。必須なのは要素の型と next だけ。",
      },
      {
        prompt: "`next` が `&self` ではなく `&mut self` を取る理由は？",
        choices: [
          "呼ぶたびにイテレータの内部状態（現在位置）を進めるから",
          "要素を書き換えるから",
          "所有権を奪うから",
          "スレッド安全にするため",
        ],
        answer: "呼ぶたびにイテレータの内部状態（現在位置）を進めるから",
        explain: "「次はどこから」を覚えておくフィールドを更新する必要がある。",
      },
      {
        prompt: "next が常に Some を返す無限イテレータ `it` に対して、終わらなくなるのは？",
        choices: [
          "it.count()",
          "it.take(5).collect::<Vec<_>>()",
          "it.next()",
          "it.take_while(|x| *x < 10).count()（いずれ 10 以上になる場合）",
        ],
        answer: "it.count()",
        explain: "count は None が来るまで回り続ける。take などで区切れば有限になる。",
      },
      {
        prompt: "`for x in &playlist { ... }` を書けるようにするには、何を実装する？",
        choices: [
          "impl<'a> IntoIterator for &'a Playlist",
          "impl Iterator for Playlist",
          "impl Display for Playlist",
          "impl From<Vec<String>> for Playlist",
        ],
        answer: "impl<'a> IntoIterator for &'a Playlist",
        explain:
          "for は対象に into_iter() を呼ぶ。&Playlist に IntoIterator を実装すると借用で回せる。",
      },
      {
        prompt:
          "Iterator の要素の型が関連型 `type Item` になっている（ジェネリクス `Iterator<T>` でない）理由は？",
        choices: [
          "1 つの型につき要素の型は 1 つに決まるので、関連型のほうが自然で使いやすいから",
          "ジェネリクスは遅いから",
          "関連型でないとライフタイムを書けないから",
          "歴史的な理由だけ",
        ],
        answer: "1 つの型につき要素の型は 1 つに決まるので、関連型のほうが自然で使いやすいから",
        explain:
          "ジェネリクスだと同じ型に複数の Iterator<T> を実装できてしまい、使う側が毎回型を指定する必要が出る。",
      },
      {
        prompt: "次のイテレータで `Counter { n: 0 }.take(3).collect::<Vec<_>>()` の結果は？",
        snippet: `struct Counter { n: u32 }
impl Iterator for Counter {
    type Item = u32;
    fn next(&mut self) -> Option<u32> {
        self.n += 2;
        Some(self.n)
    }
}
`,
        choices: ["[2, 4, 6]", "[0, 2, 4]", "[1, 2, 3]", "終わらない"],
        answer: "[2, 4, 6]",
        explain: "next のたびに n を 2 増やしてから返す。take(3) で 3 つで止まる。",
      },
    ],
  },
});
