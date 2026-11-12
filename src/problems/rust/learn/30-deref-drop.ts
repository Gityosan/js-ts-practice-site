import { defineProblem } from "../../../core/schemas";

export default defineProblem({
  id: "rust-learn-deref-drop",
  stage: "learn",
  language: "rust",
  scenario: "rust",
  copy: {
    title: "Deref と Drop（スマートポインタの正体）",
    prompt: `## スマートポインタを支える 2 つのトレイト

\`Box\`・\`Rc\`・\`String\`・\`Vec\` が「ポインタのように使えて、勝手に後片付けしてくれる」のは、次の 2 つのトレイトを実装しているから。

| トレイト | 役割 | 効果 |
|---|---|---|
| \`Deref\` / \`DerefMut\` | 参照外しの方法を決める | \`*x\` や自動参照外し、型強制 |
| \`Drop\` | 破棄されるときの処理を決める | スコープ終了時の自動クリーンアップ |

自分でこれらを実装すれば、自作の型もスマートポインタのように振る舞わせられる。

## 参照外し演算子 * のおさらい

\`\`\`rust
let x = 5;
let y = &x;      // y は x への参照
assert_eq!(5, *y); // * で参照の先の値を取り出す
// assert_eq!(5, y); // エラー: i32 と &i32 は比較できない
\`\`\`

\`Box\` も同じように \`*\` が使える。

\`\`\`rust
let y = Box::new(5);
assert_eq!(5, *y);
\`\`\`

## 自作スマートポインタと Deref

タプル構造体で包んだだけの \`MyBox<T>\` を作ってみる（ヒープには置かないが、仕組みの説明用）。

\`\`\`rust
struct MyBox<T>(T);

impl<T> MyBox<T> {
    fn new(x: T) -> MyBox<T> {
        MyBox(x)
    }
}

let y = MyBox::new(5);
// assert_eq!(5, *y); // エラー[E0614]: MyBox<i32> は参照外しできない
\`\`\`

\`*\` を使えるようにするには \`std::ops::Deref\` を実装する。

\`\`\`rust
use std::ops::Deref;

impl<T> Deref for MyBox<T> {
    type Target = T;          // 参照外ししたら何の型になるか（関連型）

    fn deref(&self) -> &T {   // 中身への参照を返す
        &self.0
    }
}

let y = MyBox::new(5);
assert_eq!(5, *y); // OK
\`\`\`

### *y の裏側

コンパイラは \`*y\` を \`*(y.deref())\` に書き換えている。

- \`y.deref()\` で \`&T\`（普通の参照）を得て
- それを普通の \`*\` で参照外しする

\`deref\` が値そのもの（\`T\`）ではなく参照（\`&T\`）を返すのは、値を返すと所有権が \`MyBox\` から出ていってしまう（ムーブ）から。

## 参照外し型強制（deref coercion）

**\`Deref\` を実装した型への参照は、関数やメソッドに渡すときに自動で \`Target\` への参照に変換される。** これが Rust で一番よくお世話になる便利機能。

\`\`\`rust
fn hello(name: &str) {
    println!("Hello, {name}!");
}

let m = MyBox::new(String::from("Rust"));
hello(&m); // &MyBox<String> → &String → &str と自動変換
\`\`\`

- \`&MyBox<String>\` は \`Deref\` で \`&String\` に
- \`&String\` は \`String: Deref<Target = str>\` で \`&str\` に
- 必要なだけ何段でも \`deref\` が挟まれる。**コンパイル時に解決されるので実行時コストはゼロ**

型強制がなかったら、こう書く必要がある。

\`\`\`rust
hello(&(*m)[..]); // (*m) で String、[..] で str、& で &str
\`\`\`

よく出会う型強制:

| 渡すもの | 受け取る型 |
|---|---|
| \`&String\` | \`&str\` |
| \`&Vec<T>\` | \`&[T]\` |
| \`&Box<T>\` | \`&T\` |
| \`&Rc<T>\` | \`&T\` |

### メソッド呼び出しの自動参照外し

\`x.method()\` と書くと、コンパイラは \`x\`, \`&x\`, \`*x\`, \`**x\` ……と順に試して、メソッドが見つかる型を探す。だから \`Box<String>\` に対して \`b.len()\` と書くだけで \`String::len\` が呼べる。

\`\`\`rust
let b = Box::new(String::from("abc"));
println!("{}", b.len());      // 3
println!("{}", b.to_uppercase()); // ABC
\`\`\`

### DerefMut と可変の型強制

\`DerefMut\` を実装すると \`&mut\` でも参照外しできる。

\`\`\`rust
use std::ops::DerefMut;

impl<T> DerefMut for MyBox<T> {
    fn deref_mut(&mut self) -> &mut T { // Target は Deref のものを使う
        &mut self.0
    }
}

let mut v = MyBox::new(vec![1, 2]);
v.push(3);       // Vec のメソッドが &mut で呼べる
*v = vec![9];    // 中身ごと置き換え
\`\`\`

型強制のルール:

- \`&T\` → \`&U\`（\`T: Deref<Target = U>\`）
- \`&mut T\` → \`&mut U\`（\`T: DerefMut<Target = U>\`）
- \`&mut T\` → \`&U\`（\`T: Deref<Target = U>\`）。可変 → 不変は安全なので OK
- **\`&T\` → \`&mut U\` はできない**（不変参照を可変参照に格上げすると借用ルールが壊れる）

### Deref の使いすぎに注意

\`Deref\` は「スマートポインタ（中身を指すもの）」のための仕組み。継承の代わりに「親の型のメソッドを全部使えるようにする」目的で乱用すると、どのメソッドがどこから来たのか分かりにくくなる。ニュータイプで一部だけ公開したいなら、必要なメソッドを自分で書くほうがよい。

## Drop: 破棄されるときの処理

\`Drop\` トレイトを実装すると、**値がスコープを抜けるときに自動で呼ばれる処理** を書ける。ファイルを閉じる、ロックを外す、ネットワーク接続を切る、などに使う。

\`\`\`rust
struct CustomSmartPointer {
    data: String,
}

impl Drop for CustomSmartPointer {
    fn drop(&mut self) {
        println!("drop: {}", self.data);
    }
}

fn main() {
    let c = CustomSmartPointer { data: String::from("c") };
    let d = CustomSmartPointer { data: String::from("d") };
    println!("作成完了");
}
\`\`\`

\`\`\`text
作成完了
drop: d
drop: c
\`\`\`

### 破棄の順序

- ローカル変数は **宣言と逆の順番** で破棄される（後に作ったものが先に消える。スタックと同じ）
- 構造体のフィールドは **宣言順** に破棄される（構造体自身の \`drop\` が先、その後フィールド）
- \`Vec\` や配列の要素は **先頭から順** に破棄される
- 値をムーブすると、破棄の責任も移動先に移る（元の場所では drop されない）
- 一時的な値（\`let\` に束縛しない値）は、その文の終わりで破棄される

\`\`\`rust
let _ = CustomSmartPointer { data: String::from("x") }; // _ は束縛しないので即座に drop
let _y = CustomSmartPointer { data: String::from("y") }; // _y は束縛されるのでスコープ終了まで生きる
\`\`\`

\`_\` と \`_y\` は似ているが動きが違うので注意（\`_\` はパターンで「無視」を意味し、値を束縛しない）。

## std::mem::drop で早めに破棄する

\`drop\` メソッドを **直接呼ぶことはできない**。

\`\`\`rust
c.drop(); // エラー[E0040]: explicit use of destructor method
\`\`\`

直接呼べてしまうと、スコープの終わりでもう一度 \`drop\` が呼ばれて **二重解放** になるから。早めに破棄したいときは、プレリュードにある関数 **\`std::mem::drop\`**（単に \`drop(x)\`）を使う。

\`\`\`rust
let c = CustomSmartPointer { data: String::from("c") };
drop(c);                 // ここで drop: c が表示される
println!("main の終わり");
// c はムーブ済みなので、スコープ終了時に二重に drop されない
\`\`\`

\`std::mem::drop\` の中身は実は空の関数 \`pub fn drop<T>(_x: T) {}\`。**引数として所有権を受け取り、関数の終わりでスコープを抜ける** ので破棄される。所有権システムをうまく使った仕組み。

\`RefCell\` の借用ガード（\`RefMut\`）や \`Mutex\` のロックを早めに返したいときにも \`drop(guard)\` を使う。

## RAII（リソースの取得は初期化である）

**RAII** は C++ 由来の考え方で、「リソースを確保するのはオブジェクトを作るとき、解放するのはオブジェクトが破棄されるとき」と結びつけるパターン。Rust では \`Drop\` がこれを実現する。

- \`File\` はスコープを抜けると閉じる
- \`MutexGuard\` はスコープを抜けるとロックを外す
- \`Box\` / \`Vec\` / \`String\` はスコープを抜けるとヒープを解放する
- \`RefCell\` の \`Ref\` / \`RefMut\` はスコープを抜けると借用を返す

\`\`\`rust
struct Guard<'a> {
    active: &'a std::cell::Cell<i32>,
}

impl<'a> Guard<'a> {
    fn new(active: &'a std::cell::Cell<i32>) -> Self {
        active.set(active.get() + 1); // 取得
        Guard { active }
    }
}

impl Drop for Guard<'_> {
    fn drop(&mut self) {
        self.active.set(self.active.get() - 1); // 解放
    }
}
\`\`\`

「解放を書き忘れる」「早期 return や panic のときに解放が漏れる」ことがない。JS の \`try { ... } finally { close() }\` を毎回書く必要がない、と考えるとよい（panic による巻き戻し中も \`drop\` は呼ばれる）。

## Copy と Drop は両立しない

\`Drop\` を実装した型には \`Copy\` を付けられない。コピーした値それぞれで \`drop\` が走ると二重解放になりかねないから。

## まとめ

| 書き方 | 意味 |
|---|---|
| \`impl Deref for T { type Target = U; fn deref(&self) -> &U }\` | \`*x\` と型強制を可能にする |
| \`impl DerefMut for T { fn deref_mut(&mut self) -> &mut U }\` | 可変の参照外し |
| \`impl Drop for T { fn drop(&mut self) { ... } }\` | 破棄時の処理 |
| \`drop(x)\` | 早めに破棄（\`x.drop()\` は不可） |`,
    hints: [
      "`Deref` を実装すると `*x` が `*(x.deref())` として使え、`&T` が自動で `&Target` に変換される（deref coercion）。",
      "`Drop` はスコープを抜けるときに自動で呼ばれる。ローカル変数は宣言と逆順に破棄される。",
      "`x.drop()` は呼べない。早めに破棄するなら `std::mem::drop(x)`。",
      "RAII: リソースの解放を `Drop` に任せると、書き忘れや早期 return での漏れがなくなる。",
    ],
  },
  learn: {
    quiz: [
      {
        prompt: "`Deref` を実装した型で `*y` と書くと、コンパイラは何に書き換える？",
        choices: ["*(y.deref())", "y.deref()", "&y", "y.into()"],
        answer: "*(y.deref())",
        explain: "deref は参照を返し、それを普通の * で参照外しする。",
      },
      {
        prompt: "`fn hello(name: &str)` に `&Box<String>` を渡せる理由は？",
        choices: [
          "参照外し型強制で &Box<String> → &String → &str と自動変換されるから",
          "Box<String> が str を継承しているから",
          "実行時に変換されるから",
          "渡せない（コンパイルエラー）",
        ],
        answer: "参照外し型強制で &Box<String> → &String → &str と自動変換されるから",
        explain: "Deref の連鎖がコンパイル時に挿入される。実行時コストはない。",
      },
      {
        prompt: "次のコードの出力の順番は？",
        snippet: `let a = Noisy("a"); // drop で名前を表示する
let b = Noisy("b");
println!("end");`,
        choices: ["end → b → a", "end → a → b", "a → b → end", "b → a → end"],
        answer: "end → b → a",
        explain: "ローカル変数はスコープの終わりで、宣言と逆の順番に破棄される。",
      },
      {
        prompt: "値を早めに破棄したいときの正しい書き方は？",
        choices: ["drop(x)", "x.drop()", "delete x", "x = null"],
        answer: "drop(x)",
        explain:
          "x.drop() を直接呼ぶと二重解放につながるので禁止（E0040）。std::mem::drop が所有権を受け取って破棄する。",
      },
      {
        prompt: "`std::mem::drop` の中身はどうなっている？",
        choices: [
          "引数を受け取るだけの空の関数",
          "メモリを 0 で埋める特殊な関数",
          "GC を呼び出す関数",
          "unsafe な free 呼び出し",
        ],
        answer: "引数を受け取るだけの空の関数",
        explain: "所有権が引数に移り、関数の終わりでスコープを抜けるので drop される。",
      },
      {
        prompt: "参照外し型強制で **できない** 変換は？",
        choices: ["&T → &mut U", "&mut T → &U", "&T → &U", "&mut T → &mut U"],
        answer: "&T → &mut U",
        explain:
          "不変参照から可変参照は作れない。他に不変参照があるかもしれず、借用ルールが壊れるため。",
      },
      {
        prompt: '`let _ = Noisy("x");` と `let _y = Noisy("y");` の違いは？',
        choices: [
          "_ は束縛しないので即座に破棄、_y はスコープの終わりまで生きる",
          "どちらも即座に破棄",
          "どちらもスコープの終わりまで生きる",
          "_ はコンパイルエラー",
        ],
        answer: "_ は束縛しないので即座に破棄、_y はスコープの終わりまで生きる",
        explain: "_ はパターンで値を無視する。_y は警告を抑える名前の付け方で、普通の変数。",
      },
      {
        prompt: "RAII の説明として正しいのは？",
        choices: [
          "リソースの解放をオブジェクトの破棄（Drop）に結びつける",
          "すべての値を参照カウントで管理する",
          "例外を使ってエラーを処理する",
          "メモリを手動で解放する",
        ],
        answer: "リソースの解放をオブジェクトの破棄（Drop）に結びつける",
        explain: "MutexGuard やファイル、Box など、Rust の多くの型が RAII で後片付けする。",
      },
    ],
  },
});
