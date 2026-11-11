import { defineProblem } from "../../../core/schemas";

export default defineProblem({
  id: "rust-rc-refcell-shared-counter",
  stage: "write",
  language: "rust",
  scenario: "rust",
  copy: {
    title: "Rc<RefCell<T>> で共有カウンタ",
    prompt: `## やること

複数のボタン（\`Clicker\`）が **1 つのカウンタを共有** し、どのボタンからでも増やせるようにしよう。

\`\`\`rust
struct Clicker {
    name: String,
    counter: Rc<RefCell<i32>>,
    history: Rc<RefCell<Vec<String>>>,
}
\`\`\`

- \`Clicker::new(name: &str, counter: &Rc<RefCell<i32>>, history: &Rc<RefCell<Vec<String>>>) -> Clicker\` … 渡されたカウンタと履歴を **共有** する
- \`click(&self, amount: i32)\` … カウンタに \`amount\` を足し、履歴に \`"A+2"\` のように \`<name>+<amount>\` を追加
- \`current(&self) -> i32\` … いまのカウンタの値

\`\`\`rust
let counter = Rc::new(RefCell::new(0));
let history = Rc::new(RefCell::new(Vec::new()));
let a = Clicker::new("A", &counter, &history);
let b = Clicker::new("B", &counter, &history);
a.click(2); b.click(5);
*counter.borrow()   // 7
b.current()         // 7
history.borrow().clone() // ["A+2", "B+5"]
\`\`\``,
    hints: [
      "`new` では `Rc::clone(counter)` で共有する。",
      "`*self.counter.borrow_mut() += amount;`",
      '履歴は `self.history.borrow_mut().push(format!("{}+{}", self.name, amount))`。',
    ],
  },
  initialCode: `use std::cell::RefCell;
use std::rc::Rc;

struct Clicker {
    name: String,
    counter: Rc<RefCell<i32>>,
    history: Rc<RefCell<Vec<String>>>,
}

impl Clicker {
    fn new(name: &str, counter: &Rc<RefCell<i32>>, history: &Rc<RefCell<Vec<String>>>) -> Clicker {
        todo!()
    }

    fn click(&self, amount: i32) {
        todo!()
    }

    fn current(&self) -> i32 {
        todo!()
    }
}
`,
  solutionCode: `use std::cell::RefCell;
use std::rc::Rc;

struct Clicker {
    name: String,
    counter: Rc<RefCell<i32>>,
    history: Rc<RefCell<Vec<String>>>,
}

impl Clicker {
    fn new(name: &str, counter: &Rc<RefCell<i32>>, history: &Rc<RefCell<Vec<String>>>) -> Clicker {
        Clicker {
            name: name.to_string(),
            counter: Rc::clone(counter),
            history: Rc::clone(history),
        }
    }

    fn click(&self, amount: i32) {
        *self.counter.borrow_mut() += amount;
        self.history.borrow_mut().push(format!("{}+{}", self.name, amount));
    }

    fn current(&self) -> i32 {
        *self.counter.borrow()
    }
}
`,
});
