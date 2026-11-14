import { defineProblem } from "../../../core/schemas";

export default defineProblem({
  id: "rust-decode-if-expression",
  stage: "decode",
  language: "rust",
  scenario: "rust",
  copy: {
    title: "if は ( ) なし、しかも値を返す",
    prompt: `## JS との違い：条件に ( ) を付けない

\`\`\`rust
let label = if score >= 80 { "合格" } else { "不合格" };
\`\`\`

- Rust の \`if\` は条件を \`( )\` で囲まない。**\`if\` から \`{\` の手前までが条件**
- \`{ }\` の中の最後の値が、その分岐の値になる
- \`if\` 全体が **値を返す式** なので、\`let label = if ...\` と変数に入れられる（三項演算子の代わり）
- 両方の分岐は **同じ型** を返す必要がある

右のコードの 2 つの \`{\` をクリックして、どちらがどの分岐か確かめよう。`,
    hints: [
      "`if` と `{` の間が条件。",
      '`{ "合格" }` の中身がその分岐の値。',
      "最後の `;` は `let` の文の終わり。",
    ],
  },
  decode: {
    code: `let score = 85;
let label = if score >= 80 { "合格" } else { "不合格" };`,
    quiz: [
      {
        prompt: "このコードの条件はどこ？",
        snippet: `if score >= 80 { "合格" }`,
        choices: ["`score >= 80`（if と { の間）", '`{ "合格" }`', "`let label`"],
        answer: "`score >= 80`（if と { の間）",
        explain: "Rust の if は条件を ( ) で囲まない。if から { の手前までが条件。",
      },
      {
        prompt: "`score` が 85 のとき、`label` の値は？",
        choices: ['"合格"', '"不合格"', "true"],
        answer: '"合格"',
        explain: '85 >= 80 は真なので、最初の { } の値 "合格" が label に入る。',
      },
      {
        prompt: "`if` を `let label = ` の右に書けるのはなぜ？",
        choices: ["if が値を返す『式』だから", "if は関数だから", "文字列だけは特別に書けるから"],
        answer: "if が値を返す『式』だから",
        explain: "Rust の if は式。三項演算子 `a ? b : c` の代わりにそのまま使える。",
      },
      {
        prompt: "`else { 0 }` のように片方だけ数値を返すとどうなる？",
        choices: ["型が合わずコンパイルエラー", "自動で文字列に変換される", "実行時に panic"],
        answer: "型が合わずコンパイルエラー",
        explain: "if 式の各分岐は同じ型を返す必要がある（エラー E0308）。",
      },
    ],
  },
});
