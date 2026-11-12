import { defineProblem } from "../../../core/schemas";

export default defineProblem({
  id: "rust-trait-default-method",
  stage: "write",
  language: "rust",
  scenario: "rust",
  copy: {
    title: "デフォルト実装と上書き",
    prompt: `## やること

デフォルト実装つきのトレイト \`Greet\` を完成させ、2 つの型に実装しよう。

\`\`\`rust
trait Greet {
    fn name(&self) -> String;          // 必須
    fn greet(&self) -> String {        // デフォルト実装: "Hello, {name}!"
        todo!()
    }
}
\`\`\`

| 型 | name() | greet() |
|---|---|---|
| \`Person { name }\` | フィールドの name | **デフォルト** をそのまま使う → \`"Hello, Alice!"\` |
| \`Robot { id }\` | \`"R-{id}"\` | **上書き** して \`"BEEP. I AM R-7."\` |

- デフォルト実装の中から、必須メソッド \`self.name()\` を呼んでよい
- Person の impl には \`greet\` を **書かない**`,
    hints: [
      'デフォルトは `format!("Hello, {}!", self.name())`',
      "Person の name は `self.name.clone()`",
      'Robot は name と greet の両方を書く: `format!("BEEP. I AM {}.", self.name())`',
    ],
  },
  initialCode: `trait Greet {
    fn name(&self) -> String;

    fn greet(&self) -> String {
        todo!()
    }
}

struct Person {
    name: String,
}

struct Robot {
    id: u32,
}

impl Greet for Person {
    fn name(&self) -> String {
        todo!()
    }
}

impl Greet for Robot {
    fn name(&self) -> String {
        todo!()
    }
}
`,
  solutionCode: `trait Greet {
    fn name(&self) -> String;

    fn greet(&self) -> String {
        format!("Hello, {}!", self.name())
    }
}

struct Person {
    name: String,
}

struct Robot {
    id: u32,
}

impl Greet for Person {
    fn name(&self) -> String {
        self.name.clone()
    }
}

impl Greet for Robot {
    fn name(&self) -> String {
        format!("R-{}", self.id)
    }

    fn greet(&self) -> String {
        format!("BEEP. I AM {}.", self.name())
    }
}
`,
});
