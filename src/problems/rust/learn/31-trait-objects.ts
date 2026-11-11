import { defineProblem } from "../../../core/schemas";

export default defineProblem({
  id: "rust-learn-trait-objects",
  stage: "learn",
  language: "rust",
  scenario: "rust",
  copy: {
    title: "トレイトオブジェクト（dyn Trait）",
    prompt: `## 異なる型をひとまとめにしたい

GUI ライブラリで「ボタン」「テキスト」「画像」を 1 つのリストに入れて、順に \`draw()\` したいとする。
JS なら配列に何でも入れて \`item.draw()\` と呼べば動く（ダックタイピング）。Rust の \`Vec<T>\` は **1 種類の型** しか入れられない。

方法は 2 つある。

- **enum** でバリアントとして列挙する（種類が固定で、全部知っているとき）
- **トレイトオブジェクト** \`dyn Trait\` を使う（種類を後から増やせるようにしたいとき）

この章は後者を扱う。

## トレイトオブジェクトの書き方

\`\`\`rust
trait Draw {
    fn draw(&self) -> String;
}

struct Button { label: String }
struct Text { body: String }

impl Draw for Button {
    fn draw(&self) -> String { format!("[{}]", self.label) }
}
impl Draw for Text {
    fn draw(&self) -> String { self.body.clone() }
}

struct Screen {
    components: Vec<Box<dyn Draw>>, // Draw を実装した「何か」の Box
}

impl Screen {
    fn render(&self) -> Vec<String> {
        self.components.iter().map(|c| c.draw()).collect()
    }
}

fn main() {
    let screen = Screen {
        components: vec![
            Box::new(Button { label: String::from("OK") }),
            Box::new(Text { body: String::from("こんにちは") }),
        ],
    };
    println!("{:?}", screen.render()); // ["[OK]", "こんにちは"]
}
\`\`\`

- \`dyn Draw\` は「Draw を実装した、何かの型」を表す **型**
- \`dyn Draw\` 自体はサイズが不定（Button と Text で大きさが違う）なので、**必ずポインタの後ろに置く**: \`Box<dyn Draw>\`、\`&dyn Draw\`、\`Rc<dyn Draw>\` など
- \`Box<Button>\` は \`Box<dyn Draw>\` に自動変換される（**unsized coercion**）
- ライブラリの利用者が \`Image\` など新しい型を作って \`Draw\` を実装すれば、Screen のコードを変えずに追加できる

## &dyn Trait で借りて渡す

所有する必要がなければ、参照 \`&dyn Trait\` で十分。

\`\`\`rust
fn show(item: &dyn Draw) -> String {
    format!("<{}>", item.draw())
}

let b = Button { label: String::from("OK") };
show(&b); // &Button → &dyn Draw に自動変換

let items: Vec<&dyn Draw> = vec![&b, &Text { body: String::from("hi") }];
\`\`\`

組み込み型にもトレイトを実装できるので、\`&dyn Trait\` のスライスで \`i32\` と \`String\` を混ぜることもできる。

## 静的ディスパッチと動的ディスパッチ

ジェネリクスでもトレイトを使える。何が違うのか？

\`\`\`rust
// ジェネリクス（静的ディスパッチ）
fn render_generic<T: Draw>(item: &T) -> String {
    item.draw()
}

// トレイトオブジェクト（動的ディスパッチ）
fn render_dyn(item: &dyn Draw) -> String {
    item.draw()
}
\`\`\`

### 静的ディスパッチ（ジェネリクス / impl Trait）

コンパイラは、使われた型ごとに関数のコピーを作る（**単相化 / monomorphization**）。

\`\`\`rust
// コンパイラが内部で作るイメージ
fn render_generic_Button(item: &Button) -> String { item.draw() }
fn render_generic_Text(item: &Text) -> String { item.draw() }
\`\`\`

- どの \`draw\` を呼ぶかが **コンパイル時に決まる**。インライン化などの最適化が効き、最速
- 型ごとにコードが増えるので、バイナリサイズが大きくなりうる
- **1 回の呼び出しで扱える型は 1 つ**。\`Vec<T>\` には同じ型しか入らない

### 動的ディスパッチ（dyn Trait）

\`&dyn Draw\` は **ファットポインタ**（太いポインタ）で、2 つのポインタを持つ。

- データへのポインタ
- **vtable**（仮想関数テーブル）へのポインタ: その型の \`draw\` などのメソッドのアドレス表

\`item.draw()\` は実行時に vtable を引いて呼ぶ関数を決める。

- 異なる型を同じ Vec に混ぜられる。関数のコピーは 1 つで済む
- 呼び出しごとに vtable を引く間接参照があり、インライン化もされにくい（わずかに遅い）
- C++ の仮想関数、Java のインターフェース呼び出しと同じ仕組み

\`\`\`rust
use std::mem::size_of;
println!("{}", size_of::<&Button>());   // 8（普通のポインタ: 64bit 環境）
println!("{}", size_of::<&dyn Draw>()); // 16（データ + vtable）
\`\`\`

## 使い分け

| | ジェネリクス \`T: Trait\` / \`impl Trait\` | トレイトオブジェクト \`dyn Trait\` |
|---|---|---|
| どの実装を呼ぶか | コンパイル時に決定 | 実行時に決定 |
| 速度 | 最速（インライン化可） | vtable 経由でわずかに遅い |
| 型を混ぜる | できない | できる |
| コードサイズ | 型ごとに増える | 1 つ |
| 戻り値で型を切り替え | \`impl Trait\` は 1 種類のみ | \`Box<dyn Trait>\` なら可能 |
| 使えるトレイト | 何でも | オブジェクト安全なものだけ |

迷ったら **まずジェネリクス**、「異なる型を 1 つのコレクションに入れたい」「実行時に型を選びたい」ときに \`dyn\` を使う、が基本方針。

ジェネリクスで受けて、内部で \`Box<dyn>\` に入れることもよくある。

\`\`\`rust
impl Screen {
    fn add<T: Draw + 'static>(&mut self, c: T) {
        self.components.push(Box::new(c)); // 呼ぶ側は Box::new を書かなくてよい
    }
}
\`\`\`

\`'static\` は「借用した参照を含まない型（または 'static な参照だけを含む型）」という意味。\`Box<dyn Draw>\` は実は \`Box<dyn Draw + 'static>\` の省略形なので、この境界が必要になる。

## オブジェクト安全性（dyn 互換性）

すべてのトレイトが \`dyn\` にできるわけではない。**オブジェクト安全（dyn compatible）** なトレイトだけがトレイトオブジェクトになれる。主な条件:

- メソッドが **\`Self\` を値として返さない**（\`fn clone(&self) -> Self\` は NG）
- メソッドが **ジェネリックな型引数を持たない**（\`fn process<T>(&self, x: T)\` は NG）
- メソッドに \`self\` を受け取るレシーバがある（\`&self\`, \`&mut self\`, \`self: Box<Self>\` など。関連関数 \`fn new() -> Self\` は NG）
- スーパートレイトに \`Sized\` を要求しない

理由: \`dyn Trait\` の向こうにある **具体的な型はコンパイル時に分からない**。\`Self\` を返そうにもサイズが分からず、ジェネリックメソッドは型ごとにコピーを作れない（vtable に載せられない）から。

\`\`\`rust
trait Shape {
    fn area(&self) -> f64;
    fn duplicate(&self) -> Self; // これがあると dyn Shape にできない
}

// let v: Vec<Box<dyn Shape>> = ...; // エラー[E0038]: the trait \`Shape\` is not dyn compatible
\`\`\`

### 直し方

- \`Self\` の代わりに \`Box<dyn Shape>\` を返す

\`\`\`rust
trait Shape {
    fn area(&self) -> f64;
    fn clone_box(&self) -> Box<dyn Shape>;
}
\`\`\`

- そのメソッドに \`where Self: Sized\` を付けて、トレイトオブジェクトからは呼べないことにする

\`\`\`rust
trait Shape {
    fn area(&self) -> f64;
    fn duplicate(&self) -> Self where Self: Sized; // dyn Shape からは呼べないが、トレイト自体は dyn にできる
}
\`\`\`

\`Clone\` トレイトは \`fn clone(&self) -> Self\` を持つので \`dyn Clone\` は作れない。\`Box<dyn Trait>\` を複製したいときに \`clone_box\` パターンがよく使われる。

## dyn Fn: クロージャのトレイトオブジェクト

クロージャは 1 つ 1 つが別の型なので、Vec に入れるときは \`Box<dyn Fn(...)>\` にする。

\`\`\`rust
let ops: Vec<Box<dyn Fn(i32) -> i32>> = vec![
    Box::new(|x| x + 1),
    Box::new(|x| x * 10),
];
let result = ops.iter().fold(3, |acc, f| f(acc)); // (3 + 1) * 10 = 40
\`\`\`

## 複数のトレイトを組み合わせる

\`dyn\` に付けられる追加の境界は **auto トレイト**（\`Send\`, \`Sync\` など）とライフタイムだけ。

\`\`\`rust
let x: Box<dyn Draw + Send> = Box::new(Button { label: String::from("OK") });
\`\`\`

\`dyn Draw + Debug\` のように普通のトレイトを 2 つ並べることはできないので、両方を要求するトレイト（スーパートレイト、33 章）を作る。

## dyn を付け忘れると

古い Rust（2015 edition）では \`Box<Trait>\` と書けたが、今は \`dyn\` が必須。edition 2021 以降では \`dyn\` を省略するとエラーになる。`,
    hints: [
      "`dyn Trait` は「そのトレイトを実装した何か」。サイズ不定なので `Box<dyn T>` / `&dyn T` のようにポインタ越しに使う。",
      "ジェネリクスは静的ディスパッチ（単相化・最速）、`dyn` は vtable を使う動的ディスパッチ（型を混ぜられる）。",
      "`Self` を返す・ジェネリックなメソッドを持つトレイトはオブジェクト安全でなく、`dyn` にできない。",
    ],
  },
  learn: {
    quiz: [
      {
        prompt: "`Vec<Box<dyn Shape>>` にできて `Vec<T>`（T: Shape）にできないことは？",
        choices: [
          "Circle と Square など異なる型の値を混ぜて入れること",
          "要素を順に処理すること",
          "要素の area を呼ぶこと",
          "要素を push すること",
        ],
        answer: "Circle と Square など異なる型の値を混ぜて入れること",
        explain: "ジェネリクスの T は 1 回の利用につき 1 つの型に決まる。dyn なら混在できる。",
      },
      {
        prompt: "`&dyn Draw` が持っている 2 つのポインタは？",
        choices: [
          "データへのポインタと vtable へのポインタ",
          "データへのポインタと長さ",
          "スタックとヒープのポインタ",
          "前の要素と次の要素へのポインタ",
        ],
        answer: "データへのポインタと vtable へのポインタ",
        explain: "vtable には具体的な型のメソッドのアドレスが並んでいて、実行時に引いて呼ぶ。",
      },
      {
        prompt: "ジェネリクスの静的ディスパッチの説明として正しいのは？",
        choices: [
          "使われた型ごとに関数のコピーが作られ、呼ぶ関数がコンパイル時に決まる",
          "実行時に vtable を引いて呼ぶ関数を決める",
          "Box が必須",
          "異なる型を Vec に混ぜられる",
        ],
        answer: "使われた型ごとに関数のコピーが作られ、呼ぶ関数がコンパイル時に決まる",
        explain: "単相化（monomorphization）と呼ぶ。最適化が効きやすい。",
      },
      {
        prompt: "次のトレイトが `dyn Shape` にできない原因は？",
        snippet: `trait Shape {
    fn area(&self) -> f64;
    fn duplicate(&self) -> Self;
}`,
        choices: [
          "duplicate が Self を値として返すから",
          "area が f64 を返すから",
          "&self を受け取るから",
          "メソッドが 2 つあるから",
        ],
        answer: "duplicate が Self を値として返すから",
        explain:
          "dyn の向こうの具体的な型（サイズ）が分からないので Self を返せない。Box<dyn Shape> を返すか where Self: Sized を付ける。",
      },
      {
        prompt: "オブジェクト安全でないメソッドはどれ？",
        choices: [
          "fn process<T>(&self, x: T)",
          "fn name(&self) -> String",
          "fn set(&mut self, v: i32)",
          "fn len(&self) -> usize",
        ],
        answer: "fn process<T>(&self, x: T)",
        explain: "ジェネリックなメソッドは型ごとにコピーが必要で、vtable に載せられない。",
      },
      {
        prompt: "クロージャを Vec にまとめるときの型として適切なのは？",
        choices: [
          "Vec<Box<dyn Fn(i32) -> i32>>",
          "Vec<Fn(i32) -> i32>",
          "Vec<impl Fn(i32) -> i32>",
          "Vec<fn>",
        ],
        answer: "Vec<Box<dyn Fn(i32) -> i32>>",
        explain:
          "クロージャは 1 つ 1 つ別の型。Box<dyn Fn> にすれば同じ型として扱える（キャプチャしないなら fn ポインタでも可）。",
      },
      {
        prompt: "戻り値の型を実行時の条件で Dog か Cat に切り替えたい。使えるのは？",
        choices: ["Box<dyn Animal>", "impl Animal", "T: Animal", "dyn Animal（Box なし）"],
        answer: "Box<dyn Animal>",
        explain:
          "impl Animal は 1 種類の具体型しか返せない。dyn Animal は単体ではサイズ不定で返せない。",
      },
    ],
  },
});
