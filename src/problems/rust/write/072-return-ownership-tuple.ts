import { defineProblem } from "../../../core/schemas";

export default defineProblem({
  id: "rust-return-ownership-tuple",
  stage: "write",
  language: "rust",
  scenario: "rust",
  copy: {
    title: "値と一緒に所有権をタプルで返す",
    prompt: `## やること

\`String\` を受け取り、**受け取った文字列そのもの** と **その文字数（char の数）** をタプルで返す関数 \`with_char_count\` を書こう。

\`\`\`rust
with_char_count(String::from("hello"))   // ("hello", 5)
with_char_count(String::from("日本語"))  // ("日本語", 3)
\`\`\`

## なぜタプルで返すのか

\`String\` を引数で受け取ると所有権が関数に移るので、何も返さなければ関数の終わりで drop されてしまう。
呼び出し元で使い続けられるよう、**所有権ごと返してあげる**。

\`\`\`rust
let (s, n) = with_char_count(s);   // 受け取った s を同じ名前でシャドーイング
\`\`\`

（次の章の **参照** を使えば、こんな面倒なことをせずに済む。）

## ポイント

- 文字数は \`s.chars().count()\`（\`s.len()\` は **バイト数** なので日本語では 3 倍になる）
- 数え終わってから \`(s, n)\` を返す`,
    hints: ["`let n = s.chars().count();`", "`(s, n)` を返す"],
  },
  initialCode: `fn with_char_count(s: String) -> (String, usize) {
    todo!()
}
`,
  solutionCode: `fn with_char_count(s: String) -> (String, usize) {
    let n = s.chars().count();
    (s, n)
}
`,
});
