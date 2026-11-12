import { defineProblem } from "../../../core/schemas";

export default defineProblem({
  id: "rust-trait-summary",
  stage: "write",
  language: "rust",
  scenario: "rust",
  copy: {
    title: "Summary トレイトを 2 つの型に実装する",
    prompt: `## やること

トレイト \`Summary\` を 2 つの構造体に実装しよう。

\`\`\`rust
trait Summary {
    fn summarize(&self) -> String;
}
\`\`\`

| 型 | summarize の結果 |
|---|---|
| \`Article { title, author }\` | \`"{title} by {author}"\` |
| \`Tweet { user, text }\` | \`"@{user}: {text}"\` |

\`\`\`rust
let a = Article { title: "Rust入門".to_string(), author: "Ferris".to_string() };
a.summarize()  // "Rust入門 by Ferris"
\`\`\`

さらに、Summary を実装した型なら何でも受け取る関数 \`notify\` も書こう。

\`\`\`rust
fn notify(item: &impl Summary) -> String  // "速報! " + summarize() の結果
\`\`\`

- 実装は \`impl Summary for Article { ... }\` の形
- \`&impl Summary\` は「Summary を実装した何かへの参照」`,
    hints: [
      "`impl Summary for Article { fn summarize(&self) -> String { ... } }`",
      '`format!("{} by {}", self.title, self.author)`',
      'notify は `format!("速報! {}", item.summarize())`',
    ],
  },
  initialCode: `trait Summary {
    fn summarize(&self) -> String;
}

struct Article {
    title: String,
    author: String,
}

struct Tweet {
    user: String,
    text: String,
}

impl Summary for Article {
    fn summarize(&self) -> String {
        todo!()
    }
}

impl Summary for Tweet {
    fn summarize(&self) -> String {
        todo!()
    }
}

fn notify(item: &impl Summary) -> String {
    todo!()
}
`,
  solutionCode: `trait Summary {
    fn summarize(&self) -> String;
}

struct Article {
    title: String,
    author: String,
}

struct Tweet {
    user: String,
    text: String,
}

impl Summary for Article {
    fn summarize(&self) -> String {
        format!("{} by {}", self.title, self.author)
    }
}

impl Summary for Tweet {
    fn summarize(&self) -> String {
        format!("@{}: {}", self.user, self.text)
    }
}

fn notify(item: &impl Summary) -> String {
    format!("速報! {}", item.summarize())
}
`,
});
