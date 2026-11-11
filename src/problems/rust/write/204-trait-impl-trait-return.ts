import { defineProblem } from "../../../core/schemas";

export default defineProblem({
  id: "rust-trait-impl-trait-return",
  stage: "write",
  language: "rust",
  scenario: "rust",
  copy: {
    title: "impl Trait を引数と戻り値に使う",
    prompt: `## やること

\`Animal\` トレイトを使って、**impl Trait** を引数と戻り値の両方で使ってみよう。

\`\`\`rust
trait Animal {
    fn name(&self) -> String;
    fn sound(&self) -> String;
    fn speak(&self) -> String {               // デフォルト実装（そのまま使う）
        format!("{} says {}", self.name(), self.sound())
    }
}
\`\`\`

- （1）\`Dog\`（name: \`"Dog"\`, sound: \`"woof"\`）と \`Cat { name: String }\`（name: フィールド, sound: \`"meow"\`）に Animal を実装する
- （2）\`fn loud(a: &impl Animal) -> String\` … \`speak()\` の結果を大文字にして末尾に \`!\` を付ける
- （3）\`fn make_cat(name: &str) -> impl Animal\` … 名前を受け取って Cat を返す（戻り値の型は「Animal を実装した何か」とだけ書く）

\`\`\`rust
loud(&Dog)                   // "DOG SAYS WOOF!"
make_cat("Tama").speak()     // "Tama says meow"
\`\`\`

- 文字列を大文字にするのは \`.to_uppercase()\``,
    hints: [
      "`struct Dog;` はフィールドのないユニット構造体。値は `Dog` と書く",
      'loud は `format!("{}!", a.speak().to_uppercase())`',
      "make_cat は `Cat { name: name.to_string() }` を返すだけ",
    ],
  },
  initialCode: `trait Animal {
    fn name(&self) -> String;
    fn sound(&self) -> String;
    fn speak(&self) -> String {
        format!("{} says {}", self.name(), self.sound())
    }
}

struct Dog;

struct Cat {
    name: String,
}

impl Animal for Dog {
    fn name(&self) -> String {
        todo!()
    }
    fn sound(&self) -> String {
        todo!()
    }
}

impl Animal for Cat {
    fn name(&self) -> String {
        todo!()
    }
    fn sound(&self) -> String {
        todo!()
    }
}

fn loud(a: &impl Animal) -> String {
    todo!()
}

fn make_cat(name: &str) -> impl Animal {
    Cat { name: todo!() }
}
`,
  solutionCode: `trait Animal {
    fn name(&self) -> String;
    fn sound(&self) -> String;
    fn speak(&self) -> String {
        format!("{} says {}", self.name(), self.sound())
    }
}

struct Dog;

struct Cat {
    name: String,
}

impl Animal for Dog {
    fn name(&self) -> String {
        String::from("Dog")
    }
    fn sound(&self) -> String {
        String::from("woof")
    }
}

impl Animal for Cat {
    fn name(&self) -> String {
        self.name.clone()
    }
    fn sound(&self) -> String {
        String::from("meow")
    }
}

fn loud(a: &impl Animal) -> String {
    format!("{}!", a.speak().to_uppercase())
}

fn make_cat(name: &str) -> impl Animal {
    Cat { name: name.to_string() }
}
`,
});
