import { defineProblem } from "../../../core/schemas";

export default defineProblem({
  id: "rust-deref-mybox",
  stage: "write",
  language: "rust",
  scenario: "rust",
  copy: {
    title: "MyBox に Deref を実装する",
    prompt: `## やること

タプル構造体 \`MyBox<T>(T)\` に \`Deref\` を実装して、\`*\` と参照外し型強制が使えるようにしよう。

\`\`\`rust
struct MyBox<T>(T);
\`\`\`

- \`MyBox::new(x)\` … 包む（用意済み）
- \`impl<T> Deref for MyBox<T>\` … \`Target = T\`、\`deref\` は \`&self.0\` を返す

実装できると、次がすべて動く。

\`\`\`rust
*MyBox::new(5)                        // 5
greet(&MyBox::new(String::from("Rust"))) // "Hello, Rust!"   &MyBox<String> → &str
MyBox::new(String::from("abc")).len() // 3                 String のメソッド
total(&MyBox::new(vec![1, 2, 3]))     // 6                 &MyBox<Vec<i32>> → &[i32]
\`\`\`

\`greet\` と \`total\` は用意済み。いまは \`Deref\` がないのでこれらの呼び出しはコンパイルエラーになる。`,
    hints: [
      "`use std::ops::Deref;` を忘れずに。",
      "`impl<T> Deref for MyBox<T> { type Target = T; fn deref(&self) -> &T { ... } }`",
      "`&self.0` でタプル構造体の 0 番目への参照を返す。",
    ],
  },
  initialCode: `use std::ops::Deref;

struct MyBox<T>(T);

impl<T> MyBox<T> {
    fn new(x: T) -> MyBox<T> {
        MyBox(x)
    }
}

// ここに impl<T> Deref for MyBox<T> を書く

fn greet(name: &str) -> String {
    format!("Hello, {}!", name)
}

fn total(xs: &[i32]) -> i32 {
    xs.iter().sum()
}
`,
  solutionCode: `use std::ops::Deref;

struct MyBox<T>(T);

impl<T> MyBox<T> {
    fn new(x: T) -> MyBox<T> {
        MyBox(x)
    }
}

impl<T> Deref for MyBox<T> {
    type Target = T;

    fn deref(&self) -> &T {
        &self.0
    }
}

fn greet(name: &str) -> String {
    format!("Hello, {}!", name)
}

fn total(xs: &[i32]) -> i32 {
    xs.iter().sum()
}
`,
});
