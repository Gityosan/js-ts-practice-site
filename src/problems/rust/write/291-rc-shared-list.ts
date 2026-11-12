import { defineProblem } from "../../../core/schemas";

export default defineProblem({
  id: "rust-rc-shared-list",
  stage: "write",
  language: "rust",
  scenario: "rust",
  copy: {
    title: "末尾を共有するリスト",
    prompt: `## やること

\`Rc\` を使ったコンスリストで、**末尾を複数のリストで共有** しよう。

\`\`\`rust
enum List {
    Cons(i32, Rc<List>),
    Nil,
}
\`\`\`

- \`prepend(x: i32, tail: &Rc<List>) -> Rc<List>\` … \`tail\` の先頭に \`x\` を付けた新しいリストを返す。\`tail\` は **共有する**（コピーしない）
- \`to_vec(list: &List) -> Vec<i32>\` … 先頭から値を集める

\`\`\`rust
let a = prepend(10, &Rc::new(Nil));   // [10]
let b = prepend(3, &a);               // [3, 10]
let c = prepend(4, &a);               // [4, 10]
Rc::strong_count(&a)                  // 3（a, b の中, c の中）
to_vec(&b)                            // [3, 10]
\`\`\``,
    hints: [
      "`Rc::new(List::Cons(x, Rc::clone(tail)))`",
      "`to_vec` は `while let List::Cons(v, rest) = cur { out.push(*v); cur = rest; }` のように進める。",
      "`rest` は `&Rc<List>` なので、`cur: &List` への代入で自動的に参照外しされる。",
    ],
  },
  initialCode: `use std::rc::Rc;

enum List {
    Cons(i32, Rc<List>),
    Nil,
}

use List::{Cons, Nil};

fn prepend(x: i32, tail: &Rc<List>) -> Rc<List> {
    todo!()
}

fn to_vec(list: &List) -> Vec<i32> {
    todo!()
}
`,
  solutionCode: `use std::rc::Rc;

enum List {
    Cons(i32, Rc<List>),
    Nil,
}

use List::{Cons, Nil};

fn prepend(x: i32, tail: &Rc<List>) -> Rc<List> {
    Rc::new(Cons(x, Rc::clone(tail)))
}

fn to_vec(list: &List) -> Vec<i32> {
    let mut out = Vec::new();
    let mut cur = list;
    while let Cons(v, rest) = cur {
        out.push(*v);
        cur = rest;
    }
    out
}
`,
});
