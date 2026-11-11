import { defineProblem } from "../../../core/schemas";

export default defineProblem({
  id: "rust-dyn-describe-ref",
  stage: "write",
  language: "rust",
  scenario: "rust",
  copy: {
    title: "&dyn Trait のスライスで型を混ぜる",
    prompt: `## やること

トレイト \`Describe\` を **組み込み型** \`i32\`・\`bool\`・\`String\` と自作の \`Point\` に実装し、\`&dyn Describe\` のスライスでまとめて扱おう。

\`\`\`rust
trait Describe {
    fn describe(&self) -> String;
}
\`\`\`

| 型 | describe の結果 |
|---|---|
| \`i32\` | \`"int 5"\` |
| \`bool\` | \`"yes"\` / \`"no"\` |
| \`String\` | \`"text 'hi'"\`（シングルクォートで囲む） |
| \`Point { x, y }\` | \`"point (1, 2)"\` |

- \`describe_all(items: &[&dyn Describe]) -> String\` … 全部の \`describe()\` を \`", "\` でつなげる

\`\`\`rust
let s = String::from("hi");
describe_all(&[&5, &true, &s, &Point { x: 1, y: 2 }])
// "int 5, yes, text 'hi', point (1, 2)"
\`\`\``,
    hints: [
      '`impl Describe for i32 { fn describe(&self) -> String { format!("int {}", self) } }`',
      '`bool` は `if *self { "yes" } else { "no" }` を `to_string()`。',
      '`items.iter().map(|d| d.describe()).collect::<Vec<_>>().join(", ")`',
    ],
  },
  initialCode: `trait Describe {
    fn describe(&self) -> String;
}

struct Point {
    x: i32,
    y: i32,
}

// ここに i32, bool, String, Point への impl Describe を書く

fn describe_all(items: &[&dyn Describe]) -> String {
    todo!()
}
`,
  solutionCode: `trait Describe {
    fn describe(&self) -> String;
}

struct Point {
    x: i32,
    y: i32,
}

impl Describe for i32 {
    fn describe(&self) -> String {
        format!("int {}", self)
    }
}

impl Describe for bool {
    fn describe(&self) -> String {
        if *self { "yes".to_string() } else { "no".to_string() }
    }
}

impl Describe for String {
    fn describe(&self) -> String {
        format!("text '{}'", self)
    }
}

impl Describe for Point {
    fn describe(&self) -> String {
        format!("point ({}, {})", self.x, self.y)
    }
}

fn describe_all(items: &[&dyn Describe]) -> String {
    items.iter().map(|d| d.describe()).collect::<Vec<_>>().join(", ")
}
`,
});
