import { defineProblem } from "../../../core/schemas";

export default defineProblem({
  id: "rust-fix-move-into-function",
  stage: "write",
  language: "rust",
  scenario: "rust",
  copy: {
    title: "【エラーを直す】関数に渡したら使えなくなった",
    prompt: `## やること

初期コードは **コンパイルエラー（E0382: borrow of moved value）** になる。直して正しく動くようにしよう。

関数 \`describe(name)\` は \`"名前 (文字数)"\` という文字列を返したい。

\`\`\`rust
describe(String::from("Rust"))   // "Rust (4)"
\`\`\`

## なぜエラーになる？

\`count_chars(name)\` を呼んだ時点で \`name\` の所有権が \`count_chars\` に移ってしまい、その後の \`format!\` で \`name\` が使えない。

## 直し方（どちらでも OK）

- **借用にする（おすすめ）**: \`count_chars\` が \`&str\` を受け取るようにし、\`count_chars(&name)\` と呼ぶ。所有権は移らない
- **複製を渡す**: \`count_chars(name.clone())\`（ヒープの複製が起きるので少し無駄）

\`format!\` は \`println!\` と同じ書式で、表示する代わりに \`String\` を作るマクロ。`,
    hints: [
      "`fn count_chars(s: &str) -> usize` に変える",
      "呼び出しを `count_chars(&name)` にする（`&String` は `&str` として渡せる）",
    ],
  },
  initialCode: `fn count_chars(s: String) -> usize {
    s.chars().count()
}

fn describe(name: String) -> String {
    let n = count_chars(name);
    format!("{name} ({n})")
}
`,
  solutionCode: `fn count_chars(s: &str) -> usize {
    s.chars().count()
}

fn describe(name: String) -> String {
    let n = count_chars(&name);
    format!("{name} ({n})")
}
`,
});
