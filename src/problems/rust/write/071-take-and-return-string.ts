import { defineProblem } from "../../../core/schemas";

export default defineProblem({
  id: "rust-take-and-return-string",
  stage: "write",
  language: "rust",
  scenario: "rust",
  copy: {
    title: "所有権を受け取って、加工して返す",
    prompt: `## やること

\`String\` の所有権を受け取り、末尾に \`!\` を \`n\` 個付け足して **返す** 関数 \`exclaim\` を書こう。

\`\`\`rust
exclaim(String::from("hello"), 3)   // "hello!!!"
exclaim(String::from("ok"), 0)      // "ok"
\`\`\`

## ポイント

- 引数で受け取った \`String\` は関数のもの（所有権が移ってきた）なので、自由に書き換えてよい
- 書き換えるには **引数に \`mut\` を付ける**: \`fn exclaim(mut s: String, n: usize)\`
- \`s.push('!')\` で 1 文字（char）を末尾に追加できる
- 最後に \`s\` を返せば、所有権が呼び出し元へ戻る（コピーは発生しない）`,
    hints: [
      "シグネチャを `fn exclaim(mut s: String, n: usize) -> String` にする",
      "`for _ in 0..n { s.push('!'); }` の後に `s`",
    ],
  },
  initialCode: `fn exclaim(s: String, n: usize) -> String {
    todo!()
}
`,
  solutionCode: `fn exclaim(mut s: String, n: usize) -> String {
    for _ in 0..n {
        s.push('!');
    }
    s
}
`,
});
