import { defineProblem } from "../../../core/schemas";

export default defineProblem({
  id: "rust-drop-raii-guard",
  stage: "write",
  language: "rust",
  scenario: "rust",
  copy: {
    title: "RAII ガードで「使用中」を数える",
    prompt: `## やること

**RAII** パターンで、「いま何個のガードが生きているか」を自動で数える \`ActiveGuard\` を作ろう。

\`\`\`rust
struct ActiveGuard {
    counter: Rc<Cell<i32>>,
}
\`\`\`

- \`ActiveGuard::new(counter: &Rc<Cell<i32>>) -> ActiveGuard\` … カウンタを **1 増やして** からガードを返す
- \`impl Drop for ActiveGuard\` … 破棄されたらカウンタを **1 減らす**
- \`with_guards(counter: &Rc<Cell<i32>>, n: usize) -> i32\` … ガードを \`n\` 個作って Vec にため、その時点のカウンタの値を返す（関数を抜けるとガードは全部破棄される）

\`\`\`rust
let c = Rc::new(Cell::new(0));
let g1 = ActiveGuard::new(&c);
let g2 = ActiveGuard::new(&c);
c.get()            // 2
drop(g1);
c.get()            // 1
with_guards(&c, 3) // 4（g2 + 3 個）
c.get()            // 1（3 個は関数の終わりで破棄済み）
\`\`\``,
    hints: [
      "`counter.set(counter.get() + 1);` してから `ActiveGuard { counter: Rc::clone(counter) }` を返す。",
      "`fn drop(&mut self) { self.counter.set(self.counter.get() - 1); }`",
      "`with_guards` は `let guards: Vec<ActiveGuard> = (0..n).map(|_| ActiveGuard::new(counter)).collect();` の後に `counter.get()`。",
    ],
  },
  initialCode: `use std::cell::Cell;
use std::rc::Rc;

struct ActiveGuard {
    counter: Rc<Cell<i32>>,
}

impl ActiveGuard {
    fn new(counter: &Rc<Cell<i32>>) -> ActiveGuard {
        todo!()
    }
}

// ここに impl Drop for ActiveGuard を書く

fn with_guards(counter: &Rc<Cell<i32>>, n: usize) -> i32 {
    todo!()
}
`,
  solutionCode: `use std::cell::Cell;
use std::rc::Rc;

struct ActiveGuard {
    counter: Rc<Cell<i32>>,
}

impl ActiveGuard {
    fn new(counter: &Rc<Cell<i32>>) -> ActiveGuard {
        counter.set(counter.get() + 1);
        ActiveGuard { counter: Rc::clone(counter) }
    }
}

impl Drop for ActiveGuard {
    fn drop(&mut self) {
        self.counter.set(self.counter.get() - 1);
    }
}

fn with_guards(counter: &Rc<Cell<i32>>, n: usize) -> i32 {
    let _guards: Vec<ActiveGuard> = (0..n).map(|_| ActiveGuard::new(counter)).collect();
    counter.get()
}
`,
});
