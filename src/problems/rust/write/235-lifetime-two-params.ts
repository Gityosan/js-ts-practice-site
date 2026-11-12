import { defineProblem } from "../../../core/schemas";

export default defineProblem({
  id: "rust-lifetime-two-params",
  stage: "write",
  language: "rust",
  scenario: "rust",
  copy: {
    title: "2 つのライフタイム 'a と 'b を使い分ける",
    prompt: `## やること

**この問題の初期コードはコンパイルできない**（E0106）。ライフタイムを付けて 2 つの関数を完成させよう。

### 1. first_of

\`first_of(a, b)\` は **a が b より長ければ a 全体、そうでなければ a の先頭 1 文字** を返す（a は空でない ASCII 文字列とする）。b は長さの比較に使うだけで、戻り値が b を指すことはない。

戻り値は a にしか依存しないので、\`'a\` と \`'b\` を別にして **戻り値を \`'a\` だけに結びつける**。そうすると b が先に破棄されても戻り値を使える。

\`\`\`rust
fn first_of<'a, 'b>(a: &'a str, b: &'b str) -> &'a str
first_of("hello", "hi")  // "hello"
first_of("hi", "hello")  // "h"
\`\`\`

### 2. split_key_value

\`"key = value"\` を \`=\` で分けて、前後の空白を除いた \`(key, value)\` を返す。\`=\` がなければ \`None\`。引数が 1 つなので省略規則で注釈なしでも書けるが、ここでは明示的に \`'a\` を書いてみよう。

\`\`\`rust
split_key_value(" name = Ferris ")  // Some(("name", "Ferris"))
\`\`\``,
    hints: [
      "`fn first_of<'a, 'b>(a: &'a str, b: &'b str) -> &'a str { if a.len() > b.len() { a } else { &a[..1] } }`",
      "`fn split_key_value<'a>(s: &'a str) -> Option<(&'a str, &'a str)>`",
      "`let (k, v) = s.split_once('=')?; Some((k.trim(), v.trim()))`",
    ],
  },
  initialCode: `fn first_of(a: &str, b: &str) -> &str {
    todo!()
}

fn split_key_value(s: &str) -> Option<(&str, &str)> {
    todo!()
}
`,
  solutionCode: `fn first_of<'a, 'b>(a: &'a str, b: &'b str) -> &'a str {
    if a.len() > b.len() { a } else { &a[..1] }
}

fn split_key_value<'a>(s: &'a str) -> Option<(&'a str, &'a str)> {
    let (k, v) = s.split_once('=')?;
    Some((k.trim(), v.trim()))
}
`,
});
