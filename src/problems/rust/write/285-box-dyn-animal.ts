import { defineProblem } from "../../../core/schemas";

export default defineProblem({
  id: "rust-box-dyn-animal",
  stage: "write",
  language: "rust",
  scenario: "rust",
  copy: {
    title: "Box<dyn Trait> で違う型を返す",
    prompt: `## やること

トレイト \`Animal\` と、それを実装する \`Dog\` / \`Cat\` / \`Cow\` がある。

- \`make_animal(kind: &str) -> Option<Box<dyn Animal>>\` … \`"dog"\` / \`"cat"\` / \`"cow"\` なら対応する動物を Box に入れて \`Some\`、それ以外は \`None\`
- \`chorus(animals: &[Box<dyn Animal>]) -> String\` … 全員の \`speak()\` を \`" "\`（半角スペース）でつなげる

\`\`\`rust
make_animal("cat").unwrap().speak() // "ニャー"
make_animal("fox").is_none()        // true
let zoo = vec![make_animal("dog").unwrap(), make_animal("cow").unwrap()];
chorus(&zoo) // "ワン モー"
\`\`\`

関数の戻り値で「条件によって違う型」を返すには、\`impl Animal\` ではなく \`Box<dyn Animal>\` が必要。`,
    hints: [
      '`match kind { "dog" => Some(Box::new(Dog)), ... , _ => None }`',
      "`Box::new(Dog)` は自動で `Box<dyn Animal>` に変換される。",
      '`animals.iter().map(|a| a.speak()).collect::<Vec<_>>().join(" ")`',
    ],
  },
  initialCode: `trait Animal {
    fn speak(&self) -> String;
}

struct Dog;
struct Cat;
struct Cow;

impl Animal for Dog {
    fn speak(&self) -> String { String::from("ワン") }
}
impl Animal for Cat {
    fn speak(&self) -> String { String::from("ニャー") }
}
impl Animal for Cow {
    fn speak(&self) -> String { String::from("モー") }
}

fn make_animal(kind: &str) -> Option<Box<dyn Animal>> {
    todo!()
}

fn chorus(animals: &[Box<dyn Animal>]) -> String {
    todo!()
}
`,
  solutionCode: `trait Animal {
    fn speak(&self) -> String;
}

struct Dog;
struct Cat;
struct Cow;

impl Animal for Dog {
    fn speak(&self) -> String { String::from("ワン") }
}
impl Animal for Cat {
    fn speak(&self) -> String { String::from("ニャー") }
}
impl Animal for Cow {
    fn speak(&self) -> String { String::from("モー") }
}

fn make_animal(kind: &str) -> Option<Box<dyn Animal>> {
    match kind {
        "dog" => Some(Box::new(Dog)),
        "cat" => Some(Box::new(Cat)),
        "cow" => Some(Box::new(Cow)),
        _ => None,
    }
}

fn chorus(animals: &[Box<dyn Animal>]) -> String {
    animals.iter().map(|a| a.speak()).collect::<Vec<_>>().join(" ")
}
`,
});
