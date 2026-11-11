import { defineProblem } from "../../../core/schemas";

export default defineProblem({
  id: "rust-trait-supertrait-outline",
  stage: "write",
  language: "rust",
  scenario: "rust",
  copy: {
    title: "スーパートレイトで枠付き表示",
    prompt: `## やること

\`Display\` を **スーパートレイト** に持つトレイト \`Outline\` を作り、デフォルトメソッドで枠付きの文字列を返そう。

\`\`\`rust
trait Outline: fmt::Display {
    fn outline(&self) -> String { /* デフォルト実装を書く */ }
}
\`\`\`

\`outline()\` は \`to_string()\`（Display による文字列）を \`*\` の枠で囲んだ 3 行の文字列を返す。

\`\`\`text
**********
* (1, 2) *
**********
\`\`\`

- 1 行目と 3 行目は \`*\` を「文字列の文字数 + 4」個
- 2 行目は \`"* " + 文字列 + " *"\`
- 行は \`\\n\` でつなぐ（最後に改行は付けない）

あわせて:

- \`Point { x, y }\` に \`Display\`（\`(1, 2)\` 形式）を実装し、\`impl Outline for Point {}\` でデフォルト実装を使う
- \`Tag(String)\` にも \`Display\`（\`<名前>\` 形式。例: \`<b>\`）と \`Outline\` を実装する

\`\`\`rust
Point { x: 1, y: 2 }.outline() // "**********\\n* (1, 2) *\\n**********"
Tag("b".to_string()).outline() // "*******\\n* <b> *\\n*******"
\`\`\``,
    hints: [
      "`let s = self.to_string();` — スーパートレイトが Display なので `to_string()` が使える。",
      '`let line = "*".repeat(s.chars().count() + 4);` してから `format!("{}\\n* {} *\\n{}", line, s, line)`。',
      '`impl fmt::Display for Point { fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result { write!(f, "({}, {})", self.x, self.y) } }`',
    ],
  },
  initialCode: `use std::fmt;

trait Outline: fmt::Display {
    fn outline(&self) -> String {
        todo!()
    }
}

struct Point {
    x: i32,
    y: i32,
}

struct Tag(String);

// ここに Point と Tag の Display と Outline を実装する
`,
  solutionCode: `use std::fmt;

trait Outline: fmt::Display {
    fn outline(&self) -> String {
        let s = self.to_string();
        let line = "*".repeat(s.chars().count() + 4);
        format!("{}\\n* {} *\\n{}", line, s, line)
    }
}

struct Point {
    x: i32,
    y: i32,
}

struct Tag(String);

impl fmt::Display for Point {
    fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
        write!(f, "({}, {})", self.x, self.y)
    }
}

impl Outline for Point {}

impl fmt::Display for Tag {
    fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
        write!(f, "<{}>", self.0)
    }
}

impl Outline for Tag {}
`,
});
