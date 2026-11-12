import { defineProblem } from "../../../core/schemas";

export default defineProblem({
  id: "rust-pick-longer-owned",
  stage: "write",
  language: "rust",
  scenario: "rust",
  copy: {
    title: "2 つの String から長い方の所有権を返す",
    prompt: `## やること

2 つの \`String\` の所有権を受け取り、**文字数（char の数）が多い方** を返す関数 \`longer\` を書こう。同じ文字数なら **1 つ目** を返す。

\`\`\`rust
longer(String::from("apple"), String::from("fig"))    // "apple"
longer(String::from("hi"), String::from("hey"))       // "hey"
longer(String::from("ab"), String::from("cd"))        // "ab"
\`\`\`

## ポイント

- 返されなかった方の \`String\` は、関数の終わりで **drop（解放）** される
- \`if\` は式なので、\`if 条件 { a } else { b }\` をそのまま関数の最後に書けば戻り値になる
- 文字数は \`s.chars().count()\``,
    hints: [
      "`if b.chars().count() > a.chars().count() { b } else { a }`",
      "同じ長さなら a を返すので、条件は「b の方が **真に** 長い」",
    ],
  },
  initialCode: `fn longer(a: String, b: String) -> String {
    todo!()
}
`,
  solutionCode: `fn longer(a: String, b: String) -> String {
    if b.chars().count() > a.chars().count() {
        b
    } else {
        a
    }
}
`,
});
