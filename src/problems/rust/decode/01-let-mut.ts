import { defineProblem } from "../../../core/schemas";

export default defineProblem({
  id: "rust-decode-let-mut",
  stage: "decode",
  language: "rust",
  scenario: "rust",
  copy: {
    title: "let と mut：変数の骨格を読む",
    prompt: `## Rust の変数は「デフォルトで変更できない」

\`\`\`rust
let mut count: i32 = 0;
\`\`\`

この 1 行は、左から次の部品でできている。

- \`let\` … 変数を作る予約語
- \`mut\` … 「あとで変更する」という印（無ければ変更禁止）
- \`count\` … 自分で付けた名前
- \`: i32\` … 型の注釈（32 ビット整数）。書かなくても推論されることが多い
- \`= 0\` … 最初の値
- \`;\` … 文の終わり

右のコードの言葉を **クリック** して、紫（予約語）と水色（名前）を見分けよう。`,
    hints: [
      "紫は Rust が決めた言葉、水色は自分で付けた名前。",
      "`mut` が無いと、あとで `count += 1` と書いたときにコンパイルエラーになる。",
      "`: i32` は型の注釈。骨格だけ読むなら飛ばしてもいい。",
    ],
  },
  decode: {
    code: `let mut count: i32 = 0;
count += 1;
let name = "Rust";`,
    quiz: [
      {
        prompt: "`let` は予約語？ それとも自分で付けた名前？",
        snippet: `let mut count: i32 = 0;`,
        choices: ["予約語", "自分で付けた名前"],
        answer: "予約語",
        explain: "`let` は変数を作るための Rust の予約語。",
      },
      {
        prompt: "`count` は予約語？ それとも自分で付けた名前？",
        choices: ["予約語", "自分で付けた名前"],
        answer: "自分で付けた名前",
        explain: "`count` は自由に付けられる名前。`total` でも `n` でも動く。",
      },
      {
        prompt: "`mut` を消すと 2 行目の `count += 1;` はどうなる？",
        snippet: `let count: i32 = 0;
count += 1;`,
        choices: ["コンパイルエラーになる", "そのまま動く", "count が 0 のまま黙って続く"],
        answer: "コンパイルエラーになる",
        explain: "Rust の変数はデフォルトで不変。変更するには `let mut` が必要（エラー E0384）。",
      },
      {
        prompt: "`: i32` は何を表す？",
        choices: ["変数の型（32 ビット整数）", "変数の初期値", "コメント"],
        answer: "変数の型（32 ビット整数）",
        explain: "`名前: 型` の形の型注釈。Rust は型推論が強いので省略されることも多い。",
      },
      {
        prompt: "3 行目の `name` に型注釈が無いのにエラーにならないのはなぜ？",
        snippet: `let name = "Rust";`,
        choices: [
          "右辺の値から型が推論されるから",
          "Rust には型が無いから",
          "文字列は型注釈が禁止だから",
        ],
        answer: "右辺の値から型が推論されるから",
        explain: '`"Rust"` から `&str` 型だとコンパイラが推論する。',
      },
    ],
  },
});
