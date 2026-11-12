import { defineProblem } from "../../../core/schemas";

export default defineProblem({
  id: "rust-lifetime-fix-errors",
  stage: "write",
  language: "rust",
  scenario: "rust",
  copy: {
    title: "ライフタイムのコンパイルエラーを直す（E0106 / E0515）",
    prompt: `## やること

**この問題の初期コードはコンパイルできない**。エラーを読んで 3 つの関数を直そう。

- （1）\`pick(flag, a, b)\` … flag が true なら a、false なら b を返す → **E0106**（ライフタイム指定が足りない）
- （2）\`first_word(s)\` … 最初の空白までの部分を返す（空白がなければ全体）。こちらは **省略規則** で注釈なしで書ける。中身を実装しよう
- （3）\`greeting(name)\` … \`"Hello, {name}"\` を返す → **E0515**（関数内で作った値への参照を返している）

\`\`\`rust
pick(true, "x", "y")        // "x"
first_word("hello world")   // "hello"
greeting("Ann")             // "Hello, Ann"
\`\`\`

直し方のヒント:
- E0106 → \`<'a>\` を宣言し、返しうる引数と戻り値に \`'a\` を付ける
- E0515 → 参照ではなく **所有する \`String\`** を返す`,
    hints: [
      "`fn pick<'a>(flag: bool, a: &'a str, b: &'a str) -> &'a str`",
      "first_word は `match s.find(' ') { Some(i) => &s[..i], None => s }`",
      'greeting は `fn greeting(name: &str) -> String { format!("Hello, {}", name) }`',
    ],
  },
  initialCode: `fn pick(flag: bool, a: &str, b: &str) -> &str {
    if flag { a } else { b }
}

fn first_word(s: &str) -> &str {
    todo!()
}

fn greeting(name: &str) -> &str {
    let s = format!("Hello, {}", name);
    &s
}
`,
  solutionCode: `fn pick<'a>(flag: bool, a: &'a str, b: &'a str) -> &'a str {
    if flag { a } else { b }
}

fn first_word(s: &str) -> &str {
    match s.find(' ') {
        Some(i) => &s[..i],
        None => s,
    }
}

fn greeting(name: &str) -> String {
    format!("Hello, {}", name)
}
`,
});
