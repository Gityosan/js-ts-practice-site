import { defineProblem } from "../../../core/schemas";

export default defineProblem({
  id: "rust-trait-fully-qualified",
  stage: "write",
  language: "rust",
  scenario: "rust",
  copy: {
    title: "同名メソッドを完全修飾構文で呼び分ける",
    prompt: `## やること

\`Human\` は、トレイト \`Pilot\`・\`Wizard\` と自分自身の 3 か所に同じ名前のメソッド \`fly\` を持っている（用意済み）。
また \`Dog\` は自分自身と \`Animal\` トレイトの両方に関連関数 \`baby_name\` を持っている（用意済み）。

次の関数を書こう。

- \`all_flights(h: &Human) -> Vec<String>\` … \`[Pilot の fly, Wizard の fly, Human 自身の fly]\` の順に並べる
- \`dog_names() -> (String, String)\` … \`(Dog 自身の baby_name, Animal としての baby_name)\`
- \`sides_total() -> u32\` … トレイト \`Polygon\` の関連定数 \`SIDES\` を \`Triangle\` と \`Square\` について足した値（7）。\`<Triangle as Polygon>::SIDES\` のように書く

\`\`\`rust
all_flights(&Human) // ["機長です", "浮遊！", "腕をばたばた"]
dog_names()         // ("ポチ", "子犬")
sides_total()       // 7
\`\`\``,
    hints: [
      "`Pilot::fly(h)` / `Wizard::fly(h)` / `h.fly()`（型自身が優先）。",
      "`Animal::baby_name()` は「どの型か」分からずエラー。`<Dog as Animal>::baby_name()` と書く。",
      "`<Triangle as Polygon>::SIDES + <Square as Polygon>::SIDES`",
    ],
  },
  initialCode: `trait Pilot {
    fn fly(&self) -> String;
}

trait Wizard {
    fn fly(&self) -> String;
}

struct Human;

impl Pilot for Human {
    fn fly(&self) -> String { String::from("機長です") }
}

impl Wizard for Human {
    fn fly(&self) -> String { String::from("浮遊！") }
}

impl Human {
    fn fly(&self) -> String { String::from("腕をばたばた") }
}

trait Animal {
    fn baby_name() -> String;
}

struct Dog;

impl Dog {
    fn baby_name() -> String { String::from("ポチ") }
}

impl Animal for Dog {
    fn baby_name() -> String { String::from("子犬") }
}

trait Polygon {
    const SIDES: u32;
}

struct Triangle;
struct Square;

impl Polygon for Triangle {
    const SIDES: u32 = 3;
}

impl Polygon for Square {
    const SIDES: u32 = 4;
}

fn all_flights(h: &Human) -> Vec<String> {
    todo!()
}

fn dog_names() -> (String, String) {
    todo!()
}

fn sides_total() -> u32 {
    todo!()
}
`,
  solutionCode: `trait Pilot {
    fn fly(&self) -> String;
}

trait Wizard {
    fn fly(&self) -> String;
}

struct Human;

impl Pilot for Human {
    fn fly(&self) -> String { String::from("機長です") }
}

impl Wizard for Human {
    fn fly(&self) -> String { String::from("浮遊！") }
}

impl Human {
    fn fly(&self) -> String { String::from("腕をばたばた") }
}

trait Animal {
    fn baby_name() -> String;
}

struct Dog;

impl Dog {
    fn baby_name() -> String { String::from("ポチ") }
}

impl Animal for Dog {
    fn baby_name() -> String { String::from("子犬") }
}

trait Polygon {
    const SIDES: u32;
}

struct Triangle;
struct Square;

impl Polygon for Triangle {
    const SIDES: u32 = 3;
}

impl Polygon for Square {
    const SIDES: u32 = 4;
}

fn all_flights(h: &Human) -> Vec<String> {
    vec![Pilot::fly(h), Wizard::fly(h), h.fly()]
}

fn dog_names() -> (String, String) {
    (Dog::baby_name(), <Dog as Animal>::baby_name())
}

fn sides_total() -> u32 {
    <Triangle as Polygon>::SIDES + <Square as Polygon>::SIDES
}
`,
});
