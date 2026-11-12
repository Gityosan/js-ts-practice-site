import { defineProblem } from "../../../core/schemas";

export default defineProblem({
  id: "rust-learn-compiler-errors",
  stage: "learn",
  language: "rust",
  scenario: "rust",
  copy: {
    title: "コンパイラエラーの読み方とよくある間違い",
    prompt: `## Rust のエラーメッセージは先生

Rust のコンパイラ（rustc）は、間違いを見つけるだけでなく **どこが・なぜ・どう直すか** まで教えてくれる。初学者が最初にやるべきことは、エラーメッセージを **最後まで読む** こと。

## エラーの構造

\`\`\`text
error[E0382]: borrow of moved value: \`s\`
 --> src/main.rs:4:20
  |
2 |     let s = String::from("hi");
  |         - move occurs because \`s\` has type \`String\`, which does not implement the \`Copy\` trait
3 |     let t = s;
  |             - value moved here
4 |     println!("{}", s);
  |                    ^ value borrowed here after move
  |
help: consider cloning the value if the performance cost is acceptable
  |
3 |     let t = s.clone();
  |              ++++++++
\`\`\`

| 部分 | 意味 |
|---|---|
| \`error[E0382]\` | エラーの種類とエラーコード |
| \`borrow of moved value\` | 何が起きたかの要約 |
| \`--> src/main.rs:4:20\` | ファイル名:行:列 |
| \`-\` や \`^\` の下線 | 関係する場所。\`^\` が主な原因、\`-\` は補足 |
| \`help:\` | 直し方の提案（\`+++\` は追加する文字） |
| \`note:\` | 補足情報 |

- エラーコードは \`rustc --explain E0382\` で詳しい解説（例付き）が読める
- **最初のエラーから順に直す**。1 つ目のエラーが原因で後続のエラーが連鎖していることが多い
- \`warning:\` はエラーではないが、未使用変数や不要な \`mut\` など、バグの兆候を教えてくれる

## 主要なエラーコード

### E0382: move 後の値を使った

\`\`\`rust
let s = String::from("hi");
let t = s;           // 所有権が t に移動
println!("{}", s);   // E0382
\`\`\`

直し方: 借用する（\`let t = &s;\`）、複製する（\`s.clone()\`）、関数には \`&s\` で渡す。\`i32\` などの \`Copy\` 型では起きない。

### E0499: 可変借用を同時に 2 つ

\`\`\`rust
let mut v = vec![1, 2];
let a = &mut v;
let b = &mut v;      // E0499
a.push(3);
\`\`\`

直し方: 片方を使い終えてからもう片方を作る。分割したいなら \`split_at_mut\` など。

### E0502: 不変借用中に可変借用

\`\`\`rust
let mut v = vec![1, 2, 3];
let first = &v[0];   // 不変借用
v.push(4);           // E0502: 可変借用（push で再確保されると first がぶら下がる）
println!("{first}");
\`\`\`

直し方: 値をコピーしておく（\`let first = v[0];\`）、または \`push\` を借用の使用が終わった後に移動する。

### E0308: 型が合わない

\`\`\`rust
fn double(x: i32) -> i32 {
    x * 2;           // E0308: \`;\` を付けたので () を返している
}
let n: i64 = 5i32;   // E0308: i32 と i64 は自動変換されない
\`\`\`

直し方: \`expected\` と \`found\` を見比べる。末尾の \`;\` を消す、\`as\` や \`into()\` で変換する、\`&str\` と \`String\` の違いに注意（\`.to_string()\` / \`&s\`）。

### E0425: 名前が見つからない

\`\`\`rust
let count = 3;
println!("{}", cuont); // E0425: タイプミス
\`\`\`

直し方: スペルを確認。スコープの外（ブロックの中で定義した変数）を使っていないか確認。rustc は似た名前を \`help: a local variable with a similar name exists\` と提案してくれる。

### E0277: トレイトが実装されていない

\`\`\`rust
struct P { x: i32 }
println!("{:?}", P { x: 1 }); // E0277: P は Debug を実装していない

fn largest<T>(a: T, b: T) -> T {
    if a > b { a } else { b }  // E0369/E0277 系: T が比較できるか分からない
}
\`\`\`

直し方: \`#[derive(Debug, Clone, PartialEq)]\` などを付ける、ジェネリクスに境界 \`T: PartialOrd\` を付ける。

### E0106: ライフタイム指定が足りない

\`\`\`rust
fn longest(a: &str, b: &str) -> &str { // E0106
    if a.len() > b.len() { a } else { b }
}
\`\`\`

直し方: 戻り値の参照がどの引数から来るかを \`<'a>\` で示す。\`fn longest<'a>(a: &'a str, b: &'a str) -> &'a str\`。または \`String\` を返す。

### E0596: mut でないものを変更しようとした

\`\`\`rust
let v = Vec::new();
v.push(1);           // E0596: v は mut でない

fn add(v: &Vec<i32>) {
    v.push(1);       // E0596: &Vec は書き換えられない
}
\`\`\`

直し方: \`let mut v\`、引数を \`&mut Vec<i32>\` にし、呼び出し側も \`&mut v\` で渡す。

## エラーコード早見表

| コード | 一言で | まず試すこと |
|---|---|---|
| E0382 | move 後に使った | \`&\` で借用 / \`.clone()\` |
| E0499 | \`&mut\` が 2 つ | 使う範囲をずらす |
| E0502 | \`&\` と \`&mut\` が同時 | コピーする / 順番を入れ替える |
| E0308 | 型が違う | 末尾の \`;\`、\`as\` / \`into()\`、\`&str\` と \`String\` |
| E0425 | 名前がない | スペル・スコープ・\`use\` |
| E0277 | トレイトがない | \`#[derive(...)]\` / トレイト境界 |
| E0106 | ライフタイムが足りない | \`<'a>\` を付ける / 所有する型を返す |
| E0596 | 不変なのに変更 | \`mut\` / \`&mut\` |
| E0384 | 不変変数に再代入 | \`let mut\` |
| E0373 | クロージャが借用したまま長生き | \`move\` を付ける |

## clippy: もっと良い書き方を教えてくれる

\`cargo clippy\` は Rust 公式のリンター。コンパイルは通るが **非効率・非慣用的・バグっぽい** 書き方を指摘してくれる。

\`\`\`bash
cargo clippy            # 指摘を表示
cargo clippy --fix      # 自動で直せるものは直す
cargo fmt               # 書式を整える（rustfmt）
\`\`\`

よくある指摘の例:

| 指摘されるコード | 慣用的な書き方 |
|---|---|
| \`if v.len() == 0\` | \`if v.is_empty()\` |
| \`fn f(v: &Vec<i32>)\` | \`fn f(v: &[i32])\`（スライスで受け取ると配列も渡せる） |
| \`fn f(s: &String)\` | \`fn f(s: &str)\` |
| \`for i in 0..v.len() { v[i] ... }\` | \`for x in &v { ... }\` / \`.iter().enumerate()\` |
| \`x.clone()\`（\`x\` が \`Copy\`） | \`x\` |
| \`return x;\`（関数の最後） | \`x\` |
| \`match opt { Some(x) => x, None => 0 }\` | \`opt.unwrap_or(0)\` |
| \`if let Some(_) = opt\` | \`if opt.is_some()\` |
| \`s.to_string()\` を \`&str\` で十分な場所で | 借用のまま渡す |

## 慣用的な書き方（idiomatic Rust）のコツ

- **借用で受け取り、所有で返す**: 引数は \`&str\` / \`&[T]\`、戻り値は \`String\` / \`Vec<T>\`
- \`unwrap()\` を乱用しない。\`?\` でエラーを呼び出し元に返す、\`if let\` / \`match\` で場合分けする
- インデックスより **イテレータ**（\`iter().map().filter().collect()\`）
- 無効な状態を **型で表せないようにする**（\`Option\` / \`enum\`）
- \`clone()\` で借用エラーを黙らせる前に、本当に複製が必要か考える（多くは借用で解決する）
- 迷ったら **コンパイラの help と clippy に従う**

## エラーと仲良くなる手順

- 最初のエラーだけを見る
- エラーコードと要約を読み、何の種類のエラーかを掴む
- \`^\` の場所と \`-\` の補足を見て、どの値がどこで問題かを確認
- \`help:\` があればまず試す。なければ \`rustc --explain\` を読む
- 直したら再コンパイル。連鎖エラーが一気に消えることも多い`,
    hints: [
      "エラーは `error[コード]: 要約`、`-->` で場所、`^` で原因、`help:` で直し方。",
      "最初のエラーから直す。`rustc --explain E0382` で詳しい解説が読める。",
      "E0382=move 後の使用、E0499/E0502=借用の衝突、E0308=型違い、E0277=トレイト不足、E0106=ライフタイム、E0596=mut 不足。",
      "`cargo clippy` で慣用的な書き方を教えてもらえる。",
    ],
  },
  learn: {
    quiz: [
      {
        prompt: "`--> src/main.rs:12:5` は何を表す？",
        choices: ["ファイル名・行番号・列番号", "エラーの数", "関数の呼び出し階層", "警告のレベル"],
        answer: "ファイル名・行番号・列番号",
        explain: "エラーが起きた場所。12 行目の 5 列目。",
      },
      {
        prompt: "次のコードで出るエラーコードは？",
        snippet: `let s = String::from("a");
let t = s;
println!("{s}");`,
        choices: ["E0382", "E0499", "E0308", "E0425"],
        answer: "E0382",
        explain: "s の所有権が t に移動した後に s を使っている（borrow of moved value）。",
      },
      {
        prompt: "次の関数のエラー（E0308）の原因は？",
        snippet: `fn add(a: i32, b: i32) -> i32 {
    a + b;
}`,
        choices: [
          "最後の式に ; を付けたので () を返している",
          "引数の型が違う",
          "return を書いていない",
          "i32 同士は足せない",
        ],
        answer: "最後の式に ; を付けたので () を返している",
        explain:
          "`;` を付けると文になり、関数は () を返すことになる。`;` を消せば a + b が戻り値になる。",
      },
      {
        prompt: '`let first = &v[0]; v.push(4); println!("{first}");` で出るエラーは？',
        choices: ["E0502", "E0382", "E0106", "E0425"],
        answer: "E0502",
        explain: "不変借用 first を使い終わる前に、push で可変借用しようとしている。",
      },
      {
        prompt: '`println!("{:?}", my_struct)` で E0277 が出た。最も簡単な直し方は？',
        choices: [
          "構造体に #[derive(Debug)] を付ける",
          "{:?} を {} に変える",
          "my_struct を clone する",
          "&my_struct にする",
        ],
        answer: "構造体に #[derive(Debug)] を付ける",
        explain: "`{:?}` には Debug トレイトが必要。derive で自動実装できる。",
      },
      {
        prompt: "clippy が勧める、関数の引数の型として慣用的なのは？",
        choices: ["&str", "&String", "String", "&mut String"],
        answer: "&str",
        explain: "&str で受け取れば String も文字列リテラルも渡せる。&Vec<T> より &[T] も同様。",
      },
      {
        prompt: "エラーが 10 個出た。まずどうする？",
        choices: [
          "最初のエラーから直して再コンパイルする",
          "最後のエラーから直す",
          "全部まとめて直す",
          "warning から直す",
        ],
        answer: "最初のエラーから直して再コンパイルする",
        explain: "後のエラーは最初のエラーの連鎖であることが多い。",
      },
      {
        prompt: "`fn longest(a: &str, b: &str) -> &str` で E0106 が出る理由は？",
        choices: [
          "戻り値の参照が a と b のどちらから来るのかコンパイラが判断できないから",
          "&str は戻り値にできないから",
          "引数が 2 つあるから",
          "String を使っていないから",
        ],
        answer: "戻り値の参照が a と b のどちらから来るのかコンパイラが判断できないから",
        explain: "`<'a>` で戻り値と引数の寿命の関係を明示する。",
      },
    ],
  },
});
