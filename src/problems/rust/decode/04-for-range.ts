import { defineProblem } from "../../../core/schemas";

export default defineProblem({
  id: "rust-decode-for-range",
  stage: "decode",
  language: "rust",
  scenario: "rust",
  copy: {
    title: "for と範囲 ..= とマクロの !",
    prompt: `## 繰り返しの骨格

\`\`\`rust
for i in 1..=5 {
    println!("{}回目", i);
}
\`\`\`

- \`for 変数 in 並び { }\` … 並びから 1 つずつ取り出して本体を実行
- \`1..=5\` は 1〜5（5 を含む）。\`1..5\` なら 1〜4（5 を含まない）
- \`println!\` の **\`!\` はマクロ** の印。\`"{}"\` の位置に後ろの値が埋め込まれる
- \`{ }\` は繰り返す本体

右のコードの \`..=\` や \`println!\` をクリックしてみよう。`,
    hints: [
      "`..` は終わりを含まない、`..=` は終わりを含む。",
      "`!` が付いたらマクロ。",
      "`{}` は文字列の中の埋め込み位置（括弧ではない）。",
    ],
  },
  decode: {
    code: `for i in 1..=5 {
    println!("{}回目", i);
}`,
    quiz: [
      {
        prompt: "`1..=5` で取り出される値は？",
        choices: ["1, 2, 3, 4, 5", "1, 2, 3, 4", "0, 1, 2, 3, 4, 5"],
        answer: "1, 2, 3, 4, 5",
        explain: "`..=` は終わりを含む範囲。",
      },
      {
        prompt: "`1..5` にすると最後に取り出される値は？",
        choices: ["4", "5", "6"],
        answer: "4",
        explain: "`..` は終わりを含まない範囲なので 1〜4。",
      },
      {
        prompt: "`println!` の `!` は何を表す？",
        choices: ["マクロであること", "否定（not）", "強調"],
        answer: "マクロであること",
        explain: "`名前!(...)` はマクロ呼び出し。書式文字列を扱えるのはマクロだから。",
      },
      {
        prompt: '`"{}回目"` の `{}` は何？',
        snippet: `println!("{}回目", i);`,
        choices: ["値を埋め込む位置（文字列の一部）", "ブロックの括弧", "空の構造体"],
        answer: "値を埋め込む位置（文字列の一部）",
        explain: "文字列の中なので構造の括弧ではない。後ろの `i` の値がここに入る。",
      },
      {
        prompt: "`for` と `in` は予約語？ それとも自分で付けた名前？",
        choices: ["予約語", "自分で付けた名前"],
        answer: "予約語",
        explain: "どちらも Rust の予約語。`i` は自分で付けた名前。",
      },
    ],
  },
});
