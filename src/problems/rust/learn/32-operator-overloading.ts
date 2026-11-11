import { defineProblem } from "../../../core/schemas";

export default defineProblem({
  id: "rust-learn-operator-overloading",
  stage: "learn",
  language: "rust",
  scenario: "rust",
  copy: {
    title: "演算子オーバーロード（std::ops と比較）",
    prompt: `## 演算子はトレイトのメソッド

Rust の \`a + b\` は、実は \`std::ops::Add\` トレイトのメソッド呼び出し \`a.add(b)\` の **糖衣構文**（シンタックスシュガー）。
だから自分の型に \`Add\` を実装すれば、\`+\` が使えるようになる。これを **演算子オーバーロード** という。

JS では演算子の動作を変えられない（\`{} + {}\` は文字列になる）が、Rust では **決められたトレイトを実装する** ことで、決められた演算子だけを安全に拡張できる。新しい演算子を作ることはできない。

## 主な演算子とトレイト

| 演算子 | トレイト | メソッド |
|---|---|---|
| \`a + b\` | \`Add\` | \`add(self, rhs)\` |
| \`a - b\` | \`Sub\` | \`sub(self, rhs)\` |
| \`a * b\` | \`Mul\` | \`mul(self, rhs)\` |
| \`a / b\` | \`Div\` | \`div(self, rhs)\` |
| \`a % b\` | \`Rem\` | \`rem(self, rhs)\` |
| \`-a\` | \`Neg\` | \`neg(self)\` |
| \`!a\` | \`Not\` | \`not(self)\` |
| \`a += b\` | \`AddAssign\` | \`add_assign(&mut self, rhs)\` |
| \`a -= b\` など | \`SubAssign\` / \`MulAssign\` ... | \`sub_assign\` ... |
| \`a[i]\` | \`Index\` | \`index(&self, i) -> &Output\` |
| \`a[i] = v\` | \`IndexMut\` | \`index_mut(&mut self, i) -> &mut Output\` |
| \`a == b\`, \`!=\` | \`PartialEq\` | \`eq(&self, other)\` |
| \`<\`, \`<=\`, \`>\`, \`>=\` | \`PartialOrd\` | \`partial_cmp(&self, other)\` |
| \`&\`, \`^\`, \`<<\`, \`>>\`（ビット演算） | \`BitAnd\` / \`BitXor\` / \`Shl\` / \`Shr\`（ビット OR は \`BitOr\`） | \`bitand\` など |

## Add を実装する

\`\`\`rust
use std::ops::Add;

#[derive(Debug, Clone, Copy, PartialEq)]
struct Point {
    x: i32,
    y: i32,
}

impl Add for Point {
    type Output = Point; // 足し算の結果の型（関連型）

    fn add(self, other: Point) -> Point {
        Point { x: self.x + other.x, y: self.y + other.y }
    }
}

fn main() {
    let p = Point { x: 1, y: 0 } + Point { x: 2, y: 3 };
    assert_eq!(p, Point { x: 3, y: 3 });
}
\`\`\`

\`Add\` トレイトの定義はこうなっている。

\`\`\`rust
trait Add<Rhs = Self> {   // Rhs（右辺の型）は省略すると Self
    type Output;          // 結果の型
    fn add(self, rhs: Rhs) -> Self::Output;
}
\`\`\`

- \`Rhs\`（right hand side）は右辺の型。**デフォルトが \`Self\`** なので \`impl Add for Point\` は「Point + Point」の意味
- \`Output\` は **関連型**。結果の型を実装側が決める（同じ型である必要はない）
- \`add\` は \`self\` を **値で受け取る**（消費する）。\`Copy\` を derive しておくと、足した後も元の変数を使える

### 右辺に違う型を取る

\`\`\`rust
use std::ops::Mul;

impl Mul<i32> for Point {     // Point * i32
    type Output = Point;
    fn mul(self, k: i32) -> Point {
        Point { x: self.x * k, y: self.y * k }
    }
}

impl Mul<Point> for i32 {     // i32 * Point（左辺が i32）
    type Output = Point;
    fn mul(self, p: Point) -> Point {
        p * self
    }
}

let a = Point { x: 1, y: 2 } * 3; // Point { x: 3, y: 6 }
let b = 3 * Point { x: 1, y: 2 }; // 同じ
\`\`\`

\`2 * p\` と \`p * 2\` は **別の実装** が必要（Rust は交換法則を勝手に仮定しない）。

### 参照に対して実装する

大きな型（行列など）で毎回ムーブ・コピーしたくないときは、参照同士の演算を実装する。

\`\`\`rust
impl<'a> Add<&'a Matrix> for &'a Matrix {
    type Output = Matrix;
    fn add(self, other: &Matrix) -> Matrix { /* ... */ }
}

let c = &a + &b; // a, b は消費されない
\`\`\`

標準ライブラリでも \`String + &str\` が \`impl Add<&str> for String\` として実装されている（だから \`s1 + &s2\` と書き、\`s1\` はムーブされる）。

## 単項演算子 Neg

\`\`\`rust
use std::ops::Neg;

impl Neg for Point {
    type Output = Point;
    fn neg(self) -> Point {
        Point { x: -self.x, y: -self.y }
    }
}

let p = -Point { x: 1, y: -2 }; // Point { x: -1, y: 2 }
\`\`\`

## 複合代入 AddAssign

\`+=\` は \`Add\` とは **別のトレイト**。\`Add\` を実装しても \`+=\` は自動では使えない。

\`\`\`rust
use std::ops::AddAssign;

impl AddAssign for Point {
    fn add_assign(&mut self, other: Point) { // &mut self で自分を書き換える。戻り値なし
        self.x += other.x;
        self.y += other.y;
    }
}

let mut p = Point { x: 1, y: 1 };
p += Point { x: 2, y: 3 }; // Point { x: 3, y: 4 }
\`\`\`

## Index / IndexMut

\`a[i]\` を使えるようにする。添字の型は自由に選べる（\`usize\` でも \`(usize, usize)\` でも \`&str\` でも）。

\`\`\`rust
use std::ops::{Index, IndexMut};

struct Grid {
    width: usize,
    cells: Vec<char>,
}

impl Index<(usize, usize)> for Grid {
    type Output = char;
    fn index(&self, (row, col): (usize, usize)) -> &char {
        &self.cells[row * self.width + col]
    }
}

impl IndexMut<(usize, usize)> for Grid {
    fn index_mut(&mut self, (row, col): (usize, usize)) -> &mut char {
        &mut self.cells[row * self.width + col]
    }
}

let mut g = Grid { width: 3, cells: vec!['.'; 9] };
g[(1, 2)] = '#';
println!("{}", g[(1, 2)]); // #
\`\`\`

- \`index\` は **参照** \`&Output\` を返す。\`g[(1, 2)]\` は \`*g.index((1, 2))\` に展開される
- \`IndexMut\` は \`Index\` を前提にしている（\`Output\` は \`Index\` のものを使う）
- 範囲外のときは \`Vec\` と同じく **panic** するのが慣例。安全版が欲しければ \`get\` メソッドを別に用意する
- 引数の位置でタプルを分解 \`(row, col): (usize, usize)\` できる

## 比較演算子: PartialEq と PartialOrd

\`==\` / \`!=\` は \`PartialEq\`、\`<\` / \`>\` / \`<=\` / \`>=\` は \`PartialOrd\`。多くの場合は derive で十分。

\`\`\`rust
#[derive(Debug, PartialEq, Eq, PartialOrd, Ord)]
struct Version {
    major: u32,
    minor: u32,
    patch: u32,
}

assert!(Version { major: 1, minor: 2, patch: 0 } < Version { major: 1, minor: 10, patch: 0 });
\`\`\`

derive の \`PartialOrd\` は **フィールドを宣言順に辞書式比較** する（major → minor → patch）。enum なら **バリアントの宣言順**。

### 手で実装する

「分数 1/2 と 2/4 は等しい」のように、フィールドの単純比較では困るときは自分で書く。

\`\`\`rust
use std::cmp::Ordering;

struct Fraction { num: i64, den: i64 } // den > 0 とする

impl PartialEq for Fraction {
    fn eq(&self, other: &Self) -> bool {
        self.num * other.den == other.num * self.den
    }
}

impl PartialOrd for Fraction {
    fn partial_cmp(&self, other: &Self) -> Option<Ordering> {
        (self.num * other.den).partial_cmp(&(other.num * self.den))
    }
}
\`\`\`

- \`eq\` を書けば \`!=\` は自動（\`ne\` のデフォルト実装）
- \`partial_cmp\` を書けば \`<\`, \`<=\`, \`>\`, \`>=\` が全部使える
- \`partial_cmp\` が \`Option\` を返すのは、**比較できない組み合わせ** がありうるから（\`f64\` の \`NaN\` は何とも比べられない）

### Partial と全順序（Eq / Ord）の違い

| トレイト | 意味 | 例 |
|---|---|---|
| \`PartialEq\` | \`==\` が使える | \`f64\`（NaN != NaN） |
| \`Eq\` | さらに「自分自身と必ず等しい」 | \`i32\`, \`String\` |
| \`PartialOrd\` | 大小比較できる（できない場合もある） | \`f64\` |
| \`Ord\` | 必ず比較できる（全順序） | \`i32\`, \`String\` |

\`sort()\` や \`max()\`、\`BTreeMap\` のキーには \`Ord\` が必要。だから \`Vec<f64>\` は \`sort()\` できず、\`sort_by(|a, b| a.partial_cmp(b).unwrap())\` と書く。

## 演算子をジェネリクスの境界に使う

\`\`\`rust
use std::ops::Add;

fn sum_all<T: Add<Output = T> + Copy + Default>(xs: &[T]) -> T {
    let mut acc = T::default();
    for &x in xs {
        acc = acc + x;
    }
    acc
}

sum_all(&[1, 2, 3]);       // 6
sum_all(&[1.5, 2.5]);      // 4.0
\`\`\`

\`Add<Output = T>\` は「足すと同じ型 T になる」という条件。関連型を境界で指定する書き方。

## 注意点

- 演算子は **直感的な意味** で実装する（\`+\` で引き算をするなど、驚かせる実装は避ける）
- \`&&\` と \`||\` はオーバーロードできない（短絡評価があるため）
- \`=\`（代入）や \`.\`（フィールドアクセス）もオーバーロードできない`,
    hints: [
      "`a + b` は `Add::add(a, b)` の糖衣構文。`type Output` で結果の型を決める。",
      "`+=` は `AddAssign`（`&mut self`）で別に実装する。`Add<Rhs>` の右辺の型はデフォルトで Self。",
      "`Index` / `IndexMut` は参照を返す。範囲外は panic が慣例。",
      "比較は `PartialEq`（==）と `PartialOrd`（< など）。derive はフィールドの宣言順に比べる。",
    ],
  },
  learn: {
    quiz: [
      {
        prompt: "`a + b` を自作の型で使えるようにするには何を実装する？",
        choices: ["std::ops::Add", "std::ops::Plus", "std::cmp::PartialEq", "std::convert::From"],
        answer: "std::ops::Add",
        explain: "+ は Add トレイトの add メソッドの糖衣構文。",
      },
      {
        prompt: "`impl Add for Point` の `type Output = Point;` は何を表す？",
        choices: ["足し算の結果の型", "右辺の型", "左辺の型", "エラーの型"],
        answer: "足し算の結果の型",
        explain: "Output は関連型。右辺の型はジェネリック引数 Rhs（デフォルトは Self）。",
      },
      {
        prompt: "`impl Mul<i32> for Point` だけを実装したとき、使えるのは？",
        choices: ["p * 3", "3 * p", "両方", "どちらも使えない"],
        answer: "p * 3",
        explain: "左辺が Point、右辺が i32 の実装。3 * p には impl Mul<Point> for i32 が別に必要。",
      },
      {
        prompt: "`Add` を実装しただけで `p += q` は使える？",
        choices: [
          "使えない。AddAssign を別に実装する",
          "使える",
          "Copy なら使える",
          "Clone なら使える",
        ],
        answer: "使えない。AddAssign を別に実装する",
        explain: "+= は AddAssign の add_assign(&mut self, rhs)。別のトレイト。",
      },
      {
        prompt: "`Index` トレイトの `index` メソッドが返すのは？",
        choices: [
          "&Self::Output（参照）",
          "Self::Output（値）",
          "Option<Self::Output>",
          "Result<Self::Output, ()>",
        ],
        answer: "&Self::Output（参照）",
        explain:
          "v[i] は *v.index(i) に展開される。値を返すと所有権が出ていってしまうため参照を返す。",
      },
      {
        prompt: "derive した PartialOrd で、次の比較の結果は？",
        snippet: `#[derive(PartialEq, PartialOrd)]
struct V { major: u32, minor: u32 }

V { major: 1, minor: 9 } < V { major: 2, minor: 0 }`,
        choices: ["true", "false", "コンパイルエラー", "None"],
        answer: "true",
        explain: "フィールドを宣言順に比べる。major が 1 < 2 で決まる。",
      },
      {
        prompt: "`Vec<f64>` に `.sort()` が使えない理由は？",
        choices: [
          "f64 は Ord を実装していない（NaN が比較できない）から",
          "f64 は PartialEq を実装していないから",
          "Vec は sort を持たないから",
          "f64 は Copy でないから",
        ],
        answer: "f64 は Ord を実装していない（NaN が比較できない）から",
        explain:
          "NaN があるので全順序にならず、PartialOrd までしか実装されていない。sort_by と partial_cmp を使う。",
      },
      {
        prompt: "オーバーロード **できない** 演算子は？",
        choices: ["&&", "-（単項）", "[]", "%"],
        answer: "&&",
        explain:
          "&& と || は短絡評価があるためトレイトがない。単項 - は Neg、[] は Index、% は Rem。",
      },
    ],
  },
});
