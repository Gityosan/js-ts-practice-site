import { defineProblem } from "../../../core/schemas";

export default defineProblem({
  id: "rust-decode-match-arms",
  stage: "decode",
  language: "rust",
  scenario: "rust",
  copy: {
    title: "match：=> の左がパターン、右が処理",
    prompt: `## match の腕を読む

\`\`\`rust
match n {
    0 => println!("ゼロ"),
    1 | 2 => println!("少し"),
    _ => println!("たくさん"),
}
\`\`\`

- \`match 値 { }\` の \`{ }\` の中に **腕（arm）** を \`,\` 区切りで並べる
- 各腕は \`パターン => 処理\`。上から順に照合して、最初に一致した腕だけ実行
- \`1 | 2\` は「1 または 2」
- \`_\` は「それ以外ぜんぶ」。Rust の match は **全パターンを網羅しないとコンパイルエラー** になるので、最後の受け皿としてよく使う`,
    hints: [
      "`=>` は「このパターンなら、この処理」をつなぐ矢印。",
      "`|` はパターンの「または」。",
      "`_` はワイルドカード。",
    ],
  },
  decode: {
    code: `match n {
    0 => println!("ゼロ"),
    1 | 2 => println!("少し"),
    _ => println!("たくさん"),
}`,
    quiz: [
      {
        prompt: "`=>` の左側は何？",
        snippet: `0 => println!("ゼロ"),`,
        choices: ["照合するパターン", "実行する処理", "戻り値の型"],
        answer: "照合するパターン",
        explain: "左がパターン、右がそのとき実行する処理。",
      },
      {
        prompt: "`n` が 2 のとき表示されるのは？",
        choices: ["少し", "ゼロ", "たくさん"],
        answer: "少し",
        explain: "`1 | 2` は 1 または 2 に一致する。",
      },
      {
        prompt: "`_ =>` の腕を消すとどうなる？",
        choices: [
          "網羅していないのでコンパイルエラー",
          "一致しない値は何もしない",
          "実行時に panic",
        ],
        answer: "網羅していないのでコンパイルエラー",
        explain: "match は全パターンの網羅が必須（E0004）。3 以上の値を扱う腕が無くなる。",
      },
      {
        prompt: "`n` が 7 のとき、実行される腕はいくつ？",
        choices: ["1 つ（最初に一致した腕だけ）", "全部", "0 個"],
        answer: "1 つ（最初に一致した腕だけ）",
        explain: "上から照合して最初に一致した腕だけが実行される（7 なら `_`）。",
      },
    ],
  },
});
