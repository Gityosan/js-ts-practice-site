import { defineProblem } from "../../../core/schemas";

export default defineProblem({
  id: "rust-learn-rc-refcell",
  stage: "learn",
  language: "rust",
  scenario: "rust",
  copy: {
    title: "Rc / RefCell / Weak（共有と内部可変性）",
    prompt: `## なぜ Rc が必要か

Rust の基本ルールは「値の所有者は 1 人」。しかし現実には **複数の場所から同じデータを持ちたい** ことがある。

- グラフで、1 つのノードを複数の辺が指す
- 2 つのリストが同じ末尾を共有する
- 設定オブジェクトを複数の部品が持つ

参照 \`&T\` で共有すると、ライフタイムで「誰が一番長生きか」をコンパイル時に決める必要がある。それが決められないときに使うのが **\`Rc<T>\`（Reference Counted、参照カウント）**。

## Rc<T> の基本

\`\`\`rust
use std::rc::Rc;

fn main() {
    let a = Rc::new(String::from("共有データ"));
    println!("{}", Rc::strong_count(&a)); // 1

    let b = Rc::clone(&a);                // 中身はコピーせず、カウントを +1
    println!("{}", Rc::strong_count(&a)); // 2

    {
        let c = Rc::clone(&a);
        println!("{}", Rc::strong_count(&a)); // 3
    } // c が破棄されてカウント -1

    println!("{}", Rc::strong_count(&a)); // 2
    println!("{} {}", a, b);              // どちらからも読める
} // a, b が破棄されてカウント 0 → ここで String が解放される
\`\`\`

- \`Rc::new(v)\` で作る。中身はヒープに置かれ、隣に **強い参照カウント（strong count）** を持つ
- \`Rc::clone(&a)\` はカウントを 1 増やすだけ（安い）。\`a.clone()\` と書いても同じ動きだが、「深いコピーではない」と読み手に伝えるため \`Rc::clone(&a)\` と書く習慣がある
- \`Rc\` が破棄されるたびにカウントが 1 減り、**0 になった瞬間に中身が解放** される
- \`Rc::strong_count(&a)\` で現在のカウントを確認できる
- \`Rc::ptr_eq(&a, &b)\` で「同じ実体を指しているか」を調べられる

### Rc の制約

- **中身は不変**（\`&T\` しか取れない）。複数の持ち主が同時に書き換えたらデータ競合になるから
- **シングルスレッド専用**。カウントの増減がアトミックでないため、スレッド間では使えない（\`Send\` でない）。スレッド間で共有するなら \`Arc<T>\`（並行性の章）
- 循環参照を作るとカウントが 0 にならず **メモリリーク** する（後述の \`Weak\` で解決）

### 例: 末尾を共有するリスト

\`\`\`rust
use std::rc::Rc;

enum List {
    Cons(i32, Rc<List>),
    Nil,
}
use List::{Cons, Nil};

fn main() {
    let a = Rc::new(Cons(5, Rc::new(Cons(10, Rc::new(Nil)))));
    let b = Cons(3, Rc::clone(&a)); // b: 3 -> a
    let c = Cons(4, Rc::clone(&a)); // c: 4 -> a
    println!("{}", Rc::strong_count(&a)); // 3（a, b の中, c の中）
}
\`\`\`

\`Box\` だと \`a\` を \`b\` にムーブした時点で \`c\` に使えないが、\`Rc\` なら両方から共有できる。

## 内部可変性と RefCell<T>

借用ルール「\`&mut\` は同時に 1 つ、\`&\` との共存も不可」は通常 **コンパイル時** に検査される。
しかし「\`&self\` しか受け取れないけれど、内部の値を変えたい」場面がある（例: テスト用のモックが呼び出し回数を記録する）。

これを可能にするのが **内部可変性（interior mutability）** パターンで、代表が **\`RefCell<T>\`**。借用ルールの検査を **実行時** に行う。

\`\`\`rust
use std::cell::RefCell;

fn main() {
    let cell = RefCell::new(vec![1, 2, 3]); // cell 自体は mut でなくてよい

    {
        let r = cell.borrow();          // 不変借用（Ref<Vec<i32>>）
        println!("{:?}", *r);           // [1, 2, 3]
    } // r が破棄されて借用終了

    cell.borrow_mut().push(4);          // 可変借用（RefMut<Vec<i32>>）してすぐ返す
    println!("{:?}", cell.borrow());    // [1, 2, 3, 4]
}
\`\`\`

- \`borrow()\` → \`Ref<T>\`（\`&T\` のように使える）
- \`borrow_mut()\` → \`RefMut<T>\`（\`&mut T\` のように使える）
- \`Ref\` / \`RefMut\` は **スコープを抜けると借用を返す**（これらも \`Drop\` を実装したスマートポインタ）
- \`RefCell\` は「今いくつ借用されているか」を実行時に数えている

### ルール違反は実行時に panic

\`\`\`rust
let cell = RefCell::new(5);
let r1 = cell.borrow_mut();
let r2 = cell.borrow_mut(); // panic! already borrowed: BorrowMutError
\`\`\`

コンパイルは通るが、実行すると panic する。**ルールそのものは同じで、検査のタイミングが違うだけ**。

| | 通常の参照 | RefCell |
|---|---|---|
| 検査のタイミング | コンパイル時 | 実行時 |
| 違反したら | コンパイルエラー | panic |
| コスト | ゼロ | カウンタの増減（わずか） |

panic させたくない場合は \`try_borrow()\` / \`try_borrow_mut()\` を使うと \`Result\` が返る。

\`\`\`rust
let cell = RefCell::new(5);
let guard = cell.borrow();
match cell.try_borrow_mut() {
    Ok(mut v) => *v += 1,
    Err(_) => println!("いまは借用中なので変更できない"),
}
\`\`\`

よくある落とし穴: \`borrow()\` の結果を変数に入れたまま、同じスコープで \`borrow_mut()\` すると panic する。借用は **必要な間だけ** にし、ブロック \`{ }\` で区切るか、1 つの式の中で使い切る。

### 例: 呼び出しを記録するモック

\`\`\`rust
use std::cell::RefCell;

trait Messenger {
    fn send(&self, msg: &str); // &self なので普通は self を変更できない
}

struct MockMessenger {
    sent: RefCell<Vec<String>>,
}

impl Messenger for MockMessenger {
    fn send(&self, msg: &str) {
        self.sent.borrow_mut().push(msg.to_string()); // &self でも変更できる
    }
}
\`\`\`

## Cell<T>: Copy な値向けの軽量版

\`Cell<T>\` も内部可変性を提供するが、**中身への参照を貸さず、値を丸ごと出し入れする** 方式。

\`\`\`rust
use std::cell::Cell;

struct Counter {
    hits: Cell<u32>,
}

impl Counter {
    fn hit(&self) {                     // &self なのに
        self.hits.set(self.hits.get() + 1); // 値を書き換えられる
    }
}
\`\`\`

- \`get()\` はコピーを返す（\`T: Copy\` のとき）、\`set(v)\` で置き換え
- \`replace(v)\` は古い値を返して置き換え、\`take()\` はデフォルト値と交換
- 参照を貸さないので **実行時の借用チェックも panic もない**。\`i32\` や \`bool\` のカウンタ・フラグに向いている

| | Cell<T> | RefCell<T> |
|---|---|---|
| 中身へのアクセス | 値のコピー・入れ替え | 参照（Ref / RefMut） |
| 向いている型 | Copy な小さい値 | Vec や String など |
| 実行時の panic | なし | 借用ルール違反で panic |

## Rc<RefCell<T>>: 共有 + 変更

\`Rc\` は共有できるが変更できない。\`RefCell\` は変更できるが共有できない。**組み合わせると「複数の持ち主が、それぞれ変更できる」** データになる。

\`\`\`rust
use std::cell::RefCell;
use std::rc::Rc;

fn main() {
    let shared = Rc::new(RefCell::new(0));

    let a = Rc::clone(&shared);
    let b = Rc::clone(&shared);

    *a.borrow_mut() += 10;
    *b.borrow_mut() += 5;

    println!("{}", shared.borrow()); // 15（全員が同じ値を見ている）
}
\`\`\`

- \`a.borrow_mut()\` は、\`Rc\` の自動参照外しで中の \`RefCell\` のメソッドが呼ばれている
- \`*a.borrow_mut() += 10\` の \`*\` は \`RefMut<i32>\` を参照外しして中の \`i32\` に足している
- JS のオブジェクト参照の共有に近い使い心地だが、「共有している」「変更する」ことが型に現れる

## 循環参照とメモリリーク

\`Rc\` 同士が互いを指すと、どちらのカウントも 0 にならず、**永遠に解放されない**（メモリリーク）。Rust のメモリ安全性は「リークしないこと」までは保証しない。

\`\`\`rust
// a -> b -> a という輪を作ると、スコープを抜けても a も b もカウントが 1 残る
\`\`\`

## Weak<T>: 所有しない参照

\`Weak<T>\` は **強い参照カウントを増やさない** 参照。\`Weak\` が残っていても、強い参照が 0 になれば中身は解放される。

\`\`\`rust
use std::rc::{Rc, Weak};

let strong = Rc::new(5);
let weak: Weak<i32> = Rc::downgrade(&strong); // weak_count が +1、strong_count はそのまま

println!("{}", Rc::strong_count(&strong)); // 1
println!("{}", Rc::weak_count(&strong));   // 1

// 使うときは upgrade で Option<Rc<T>> に戻す
if let Some(rc) = weak.upgrade() {
    println!("まだ生きている: {}", rc);
}

drop(strong);
println!("{:?}", weak.upgrade()); // None（中身はもう解放された）
\`\`\`

- \`Rc::downgrade(&rc)\` で \`Weak\` を作る
- \`weak.upgrade()\` は \`Option<Rc<T>>\`。中身が解放済みなら \`None\`
- \`Weak::new()\` で「何も指していない Weak」を作れる（\`upgrade\` すると常に \`None\`）

### 典型例: 親を知っている木

**親 → 子は所有（Rc）、子 → 親は所有しない（Weak）** にすると循環しない。

\`\`\`rust
use std::cell::RefCell;
use std::rc::{Rc, Weak};

struct Node {
    value: i32,
    parent: RefCell<Weak<Node>>,      // 後から設定するので RefCell
    children: RefCell<Vec<Rc<Node>>>, // 後から追加するので RefCell
}

fn main() {
    let leaf = Rc::new(Node { value: 3, parent: RefCell::new(Weak::new()), children: RefCell::new(vec![]) });
    let branch = Rc::new(Node { value: 5, parent: RefCell::new(Weak::new()), children: RefCell::new(vec![Rc::clone(&leaf)]) });

    *leaf.parent.borrow_mut() = Rc::downgrade(&branch);

    let p = leaf.parent.borrow().upgrade().map(|p| p.value);
    println!("{:?}", p); // Some(5)
    println!("{} {}", Rc::strong_count(&branch), Rc::weak_count(&branch)); // 1 1
}
\`\`\`

## どれを使う？

| 型 | 所有者 | 変更 | 検査 | 用途 |
|---|---|---|---|---|
| \`Box<T>\` | 1 | 可（mut なら） | コンパイル時 | ヒープ確保・再帰型 |
| \`Rc<T>\` | 複数 | 不可 | コンパイル時 | 読み取り専用の共有 |
| \`RefCell<T>\` | 1 | \`&self\` からでも可 | 実行時 | 内部可変性 |
| \`Cell<T>\` | 1 | \`&self\` からでも可 | なし（値の出し入れ） | Copy なカウンタ・フラグ |
| \`Rc<RefCell<T>>\` | 複数 | 可 | 実行時 | 共有して変更 |
| \`Weak<T>\` | 0（所有しない） | - | - | 循環を断つ・親への参照 |`,
    hints: [
      "`Rc::clone` は中身をコピーせずカウントを +1。カウントが 0 になると解放される。",
      "`RefCell` は借用ルールを実行時に検査する。違反すると panic（`try_borrow_mut` なら Result）。",
      "`Rc<RefCell<T>>` で「共有して、変更もできる」データを作れる。",
      "子 → 親など所有しない参照は `Weak`（`Rc::downgrade` / `upgrade`）で循環参照を防ぐ。",
    ],
  },
  learn: {
    quiz: [
      {
        prompt: "次のコードで最後に表示される値は？",
        snippet: `let a = Rc::new(1);
let b = Rc::clone(&a);
{
    let c = Rc::clone(&a);
}
println!("{}", Rc::strong_count(&a));`,
        choices: ["2", "1", "3", "0"],
        answer: "2",
        explain: "a と b の 2 つ。c はブロックを抜けたときに破棄されてカウントが 1 減っている。",
      },
      {
        prompt: "`Rc::clone(&a)` が行うことは？",
        choices: [
          "参照カウントを 1 増やし、同じ実体を指す Rc を作る",
          "中身を深いコピーする",
          "a をムーブする",
          "Weak 参照を作る",
        ],
        answer: "参照カウントを 1 増やし、同じ実体を指す Rc を作る",
        explain: "中身は共有されたまま。コピーのコストはかからない。",
      },
      {
        prompt: "次のコードを実行するとどうなる？",
        snippet: `let cell = RefCell::new(5);
let a = cell.borrow_mut();
let b = cell.borrow_mut();`,
        choices: [
          "実行時に panic する",
          "コンパイルエラーになる",
          "b が 5 になる",
          "a が自動で解放される",
        ],
        answer: "実行時に panic する",
        explain:
          "RefCell は借用ルールを実行時に検査する。可変借用が 2 つ重なったので already borrowed で panic する。",
      },
      {
        prompt: "`&self` のメソッドから、構造体内の `u32` カウンタを増やしたい。最も軽い方法は？",
        choices: [
          "Cell<u32> にして get / set する",
          "Rc<u32> にする",
          "Box<u32> にする",
          "メソッドを &self のまま mut を付けた変数に代入する",
        ],
        answer: "Cell<u32> にして get / set する",
        explain: "Copy な小さい値なら Cell が最も簡単で、実行時 panic の心配もない。",
      },
      {
        prompt: "複数の持ち主が同じ Vec を共有し、どの持ち主からも push したい。適切な型は？",
        choices: [
          "Rc<RefCell<Vec<i32>>>",
          "Rc<Vec<i32>>",
          "RefCell<Rc<Vec<i32>>>",
          "Box<Vec<i32>>",
        ],
        answer: "Rc<RefCell<Vec<i32>>>",
        explain: "Rc で共有し、RefCell で内部可変性を得る。Rc<Vec> だけでは中身を変更できない。",
      },
      {
        prompt: "`weak.upgrade()` の戻り値の型は？",
        choices: ["Option<Rc<T>>", "Rc<T>", "&T", "Result<T, ()>"],
        answer: "Option<Rc<T>>",
        explain:
          "指している値がまだ生きていれば Some(Rc)、強い参照が 0 になって解放済みなら None。",
      },
      {
        prompt: "木構造で子から親への参照に Weak を使う理由は？",
        choices: [
          "親と子が互いに Rc で指し合う循環参照を防ぎ、メモリリークを避けるため",
          "Weak のほうが速いから",
          "親を変更できるようにするため",
          "スレッド間で共有するため",
        ],
        answer: "親と子が互いに Rc で指し合う循環参照を防ぎ、メモリリークを避けるため",
        explain: "Weak は強い参照カウントを増やさないので、親が不要になれば正しく解放される。",
      },
      {
        prompt: "Rc<T> について正しくないものは？",
        choices: [
          "スレッド間で安全に共有できる",
          "中身は不変でしか借りられない",
          "カウントが 0 になると中身が解放される",
          "Rc::strong_count で参照数がわかる",
        ],
        answer: "スレッド間で安全に共有できる",
        explain: "Rc はシングルスレッド専用。スレッド間では Arc を使う。",
      },
    ],
  },
});
