import { defineProblem } from "../../../core/schemas";

export default defineProblem({
  id: "rust-fix-dangling-reference",
  stage: "write",
  language: "rust",
  scenario: "rust",
  copy: {
    title: "【エラーを直す】ダングリング参照を返さない",
    prompt: `## やること

初期コードは **コンパイルエラー（E0515: cannot return reference to local variable）** になる。直して正しく動くようにしよう。

関数 \`make_greeting(name)\` は \`"Hello, 名前!"\` という文字列を作って返したい。

\`\`\`rust
make_greeting("Rust")   // "Hello, Rust!"
\`\`\`

## なぜエラーになる？

\`\`\`rust
fn make_greeting(name: &str) -> &String {
    let s = format!("Hello, {name}!");
    &s     // s は関数の終わりで drop される → 参照だけが残る（ダングリング参照）
}
\`\`\`

関数の中で作った値は、関数を抜けると解放される。その参照を返すと、解放済みのメモリを指してしまう。

## 直し方

参照ではなく **値（所有権）そのもの** を返す。戻り値の型を \`String\` にして、\`s\` をそのまま返そう。`,
    hints: [
      "戻り値の型を `-> String` に変える",
      "`&s` ではなく `s` を返す（format! の結果を直接返してもよい）",
    ],
  },
  initialCode: `fn make_greeting(name: &str) -> &String {
    let s = format!("Hello, {name}!");
    &s
}
`,
  solutionCode: `fn make_greeting(name: &str) -> String {
    let s = format!("Hello, {name}!");
    s
}
`,
});
