import { defineProblem } from "../../../core/schemas";

export default defineProblem({
  id: "rust-learn-unsafe-ffi",
  stage: "learn",
  language: "rust",
  scenario: "rust",
  copy: {
    title: "unsafe と FFI の概要",
    prompt: `## unsafe とは

Rust のコンパイラ（借用チェッカーなど）は **保守的** で、「安全だと証明できないもの」は拒否する。しかし、実際には安全なのにコンパイラには証明できないコードや、OS・ハードウェア・C ライブラリとのやりとりのように、そもそもコンパイラが検査しようがないコードもある。

そこで **\`unsafe\` ブロック** の中でだけ、いくつかの追加操作が許される。

\`\`\`rust
let x = 5;
let p = &x as *const i32; // 生ポインタを作るのは安全
unsafe {
    println!("{}", *p);   // 参照外しは unsafe の中でだけ
}
\`\`\`

**重要**: \`unsafe\` は「チェックを全部切る」ものではない。借用チェックも型チェックもいつも通り行われる。**追加で 5 つのことができるようになるだけ** で、その部分の安全性を **プログラマが保証する** という宣言。

## unsafe でできる 5 つのこと

| できること | 例 |
|---|---|
| 生ポインタの参照外し | \`*p\`（\`p: *const T\` / \`*mut T\`） |
| unsafe な関数・メソッドを呼ぶ | \`slice::from_raw_parts\`、\`get_unchecked\`、C の関数 |
| 可変な static 変数へのアクセス | \`static mut COUNTER: u32\` の読み書き |
| unsafe トレイトの実装 | \`unsafe impl Send for MyType {}\` |
| union のフィールドを読む | \`union IntOrFloat { i: u32, f: f32 }\` |

## 生ポインタ（raw pointer）

| 型 | 意味 |
|---|---|
| \`*const T\` | 読み取り用の生ポインタ |
| \`*mut T\` | 書き込みもできる生ポインタ |

参照（\`&T\` / \`&mut T\`）との違い:

- null でもよい、ぶら下がって（解放済みを指して）いてもよい
- 借用ルールに従わない（\`*mut\` を同時に何個でも作れる）
- 自動で解放されない、ライフタイムがない

\`\`\`rust
let mut num = 10;
let r1 = &num as *const i32;     // 作るだけなら safe
let r2 = &raw mut num;           // Rust 1.82+ の書き方（参照を経由せず直接作る）
unsafe {
    *r2 += 1;                    // 書き込み
    println!("{}", *r1);         // 11
}

// ポインタ演算
let arr = [10, 20, 30];
let p = arr.as_ptr();
unsafe {
    println!("{}", *p.add(2));   // 30（2 つ先の要素）
}
\`\`\`

作る・コピーする・比較するのは安全。**参照外し（中身を読む・書く）が危険** なので unsafe が必要。

## unsafe fn

呼ぶ側が守るべき前提条件がある関数は \`unsafe fn\` にする。

\`\`\`rust
/// # Safety
/// \`index\` は \`v.len()\` 未満でなければならない
unsafe fn get_fast(v: &[i32], index: usize) -> i32 {
    unsafe { *v.get_unchecked(index) } // 境界チェックなし
}

fn main() {
    let v = [1, 2, 3];
    let x = unsafe { get_fast(&v, 1) }; // 呼ぶ側が「前提を守った」と宣言
    println!("{x}");
}
\`\`\`

- ドキュメントに **\`# Safety\`** の節を書き、何を守れば安全かを明記するのが慣習
- edition 2024 では、\`unsafe fn\` の本体の中でも unsafe な操作には \`unsafe { }\` ブロックが必要（\`unsafe_op_in_unsafe_fn\` が警告になる）

## 安全な抽象化で包む

unsafe の正しい使い方は、**小さな unsafe を安全な API の中に閉じ込める** こと。標準ライブラリの \`Vec\` や \`split_at_mut\` も中身は unsafe だが、外からは安全に使える。

\`split_at_mut\` は、1 つのスライスを **重ならない 2 つの可変スライス** に分ける。借用チェッカーは「同じスライスから 2 つの \`&mut\`」を許さないので、普通には書けない。

\`\`\`rust
fn my_split_at_mut(s: &mut [i32], mid: usize) -> (&mut [i32], &mut [i32]) {
    let len = s.len();
    let ptr = s.as_mut_ptr();
    assert!(mid <= len); // 前提条件を実行時に確かめる → だからこの関数は safe にできる
    unsafe {
        (
            std::slice::from_raw_parts_mut(ptr, mid),
            std::slice::from_raw_parts_mut(ptr.add(mid), len - mid),
        )
    }
}
\`\`\`

- \`assert!\` で前提を確かめているので、どんな引数で呼ばれても未定義動作にならない → **関数自体は safe な \`fn\` にできる**
- 呼ぶ人は unsafe を意識しなくてよい。危険な部分は数行に限定され、レビューしやすい

ふだんは自分で書かずに、標準の安全な API を使えばよい。

\`\`\`rust
let mut v = [1, 2, 3, 4, 5];
let (a, b) = v.split_at_mut(2);
a[0] = 100;
b[0] = 300;      // a と b は重ならないので同時に変更できる
println!("{:?}", v); // [100, 2, 300, 4, 5]
\`\`\`

## FFI: 他の言語の関数を呼ぶ

FFI（Foreign Function Interface）で C などの関数を呼べる。

\`\`\`rust
unsafe extern "C" {
    fn abs(input: i32) -> i32;       // C 標準ライブラリの abs
}

fn main() {
    let x = unsafe { abs(-3) };      // 外部関数の呼び出しは unsafe
    println!("{x}");                 // 3
}
\`\`\`

- \`extern "C"\` の \`"C"\` は **ABI**（呼び出し規約）。C の流儀で引数を渡すという意味
- edition 2024 では \`extern\` ブロックに \`unsafe\` を付けて \`unsafe extern "C" { ... }\` と書く
- Rust コンパイラは C 側の中身を検査できないので、呼び出しは unsafe
- 逆に、C から呼べる Rust 関数も作れる

\`\`\`rust
#[unsafe(no_mangle)]                 // 関数名をそのまま残す（edition 2024 の書き方）
pub extern "C" fn rust_add(a: i32, b: i32) -> i32 {
    a + b
}
\`\`\`

実務では \`bindgen\`（C ヘッダから Rust の宣言を生成）や \`cxx\`、Python 連携の \`PyO3\` などのツールを使うことが多い。

## static mut の危険

\`static mut\` は **プログラム全体で共有される書き換え可能な変数**。どのスレッドからでも触れるので、データ競合が起きうる。

\`\`\`rust
static mut COUNTER: u32 = 0;

fn increment() {
    unsafe {
        COUNTER += 1; // 2 つのスレッドが同時に呼ぶとデータ競合（未定義動作）
    }
}
\`\`\`

- 読み書きはすべて unsafe
- edition 2024 では \`static mut\` への参照を作ること（\`&COUNTER\`）自体がエラー（\`static_mut_refs\`）
- **代わりに使うべきもの**: \`AtomicU32\` などのアトミック型、\`Mutex\`、\`OnceLock\` / \`LazyLock\`

\`\`\`rust
use std::sync::atomic::{AtomicU32, Ordering};

static COUNTER: AtomicU32 = AtomicU32::new(0); // mut 不要・unsafe 不要

fn increment() {
    COUNTER.fetch_add(1, Ordering::Relaxed);
}
\`\`\`

## 未定義動作（UB）

unsafe の中で約束を破ると **未定義動作** になる。「たまたま動く」「最適化で突然壊れる」「別の場所でおかしくなる」など何が起きても文句が言えない。代表例:

- null やぶら下がりポインタの参照外し
- 同じデータに \`&mut\` を 2 つ同時に作る（エイリアス規則違反）
- 範囲外のメモリへのアクセス
- 初期化していないメモリを読む
- \`bool\` に 0/1 以外の値を入れるなど、型の不変条件を破る

\`cargo +nightly miri test\` で使える **Miri** は、unsafe コードの未定義動作を検出してくれるツール。

## まとめ

- unsafe は「5 つの操作を許す」だけで、他のチェックは残る
- unsafe は最小限にし、安全な API で包む。前提条件は \`# Safety\` に書くか \`assert!\` で確かめる
- FFI は \`extern "C"\`。呼び出しは unsafe
- \`static mut\` は避け、アトミック型や \`Mutex\` を使う`,
    hints: [
      "unsafe でできるのは 5 つだけ（生ポインタの参照外し・unsafe fn の呼び出し・static mut・unsafe トレイト・union）。",
      "生ポインタは作るのは安全、参照外しが unsafe。",
      "小さな unsafe を安全な関数で包み、前提条件は `assert!` などで保証する。",
      "`static mut` の代わりにアトミック型や `Mutex` を使う。",
    ],
  },
  learn: {
    quiz: [
      {
        prompt: "`unsafe` ブロックの中で **無効にならない** ものは？",
        choices: [
          "借用チェック",
          "生ポインタの参照外しの禁止",
          "unsafe fn 呼び出しの禁止",
          "static mut アクセスの禁止",
        ],
        answer: "借用チェック",
        explain: "unsafe は追加の操作を許すだけで、借用チェックや型チェックはそのまま行われる。",
      },
      {
        prompt: "次のうち unsafe ブロックが **必要ない** 操作は？",
        choices: [
          "生ポインタを作る（&x as *const i32）",
          "生ポインタを参照外しする（*p）",
          "static mut の値を読む",
          'extern "C" の関数を呼ぶ',
        ],
        answer: "生ポインタを作る（&x as *const i32）",
        explain: "生ポインタを作るだけなら安全。危険なのは参照外し。",
      },
      {
        prompt:
          "`split_at_mut` が内部で unsafe を使っているのに safe な関数として公開できる理由は？",
        choices: [
          "mid <= len を確かめてから、重ならない 2 つのスライスを作るので、どう呼ばれても安全だから",
          "unsafe を使った関数は自動で safe になるから",
          "スライスは unsafe の対象外だから",
          "コンパイラが中身を検査しているから",
        ],
        answer:
          "mid <= len を確かめてから、重ならない 2 つのスライスを作るので、どう呼ばれても安全だから",
        explain:
          "前提条件を実行時にチェックすることで、未定義動作が起きないことを関数が保証している。",
      },
      {
        prompt: '`extern "C"` の `"C"` が表すものは？',
        choices: [
          "ABI（呼び出し規約）",
          "C 言語のソースファイル名",
          "文字コード",
          "コンパイラの名前",
        ],
        answer: "ABI（呼び出し規約）",
        explain: "関数の引数や戻り値をどう受け渡すかの約束事を C の流儀に合わせる。",
      },
      {
        prompt: "グローバルなカウンタを安全に作るには？",
        choices: [
          "static COUNTER: AtomicU32 = AtomicU32::new(0);",
          "static mut COUNTER: u32 = 0;",
          "let mut COUNTER: u32 = 0; をトップレベルに書く",
          "const mut COUNTER: u32 = 0;",
        ],
        answer: "static COUNTER: AtomicU32 = AtomicU32::new(0);",
        explain: "アトミック型は &self で変更できるので mut も unsafe も要らず、スレッド安全。",
      },
      {
        prompt: "unsafe fn のドキュメントに書く慣習になっている節は？",
        choices: ["# Safety", "# Panics", "# Examples", "# Errors"],
        answer: "# Safety",
        explain: "呼び出し側が守るべき前提条件を `# Safety` に書く。",
      },
    ],
  },
});
