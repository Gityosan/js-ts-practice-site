import { defineProblem } from "../../../core/schemas";

export default defineProblem({
  id: "rust-drop-log-order",
  stage: "write",
  language: "rust",
  scenario: "rust",
  copy: {
    title: "Drop で破棄の順番を記録する",
    prompt: `## やること

\`Noisy\` が破棄されるときに、共有ログ（\`Rc<RefCell<Vec<String>>>\`）へ \`"drop <名前>"\` を書き込むようにしよう。

\`\`\`rust
struct Noisy {
    name: String,
    log: Rc<RefCell<Vec<String>>>,
}
\`\`\`

- \`Noisy::new(name: &str, log: &Rc<RefCell<Vec<String>>>) -> Noisy\` … ログを共有して作る
- \`impl Drop for Noisy\` … \`drop\` で \`"drop a"\` のように記録する

採点では次のような順番を確かめる。

\`\`\`rust
{
    let _a = Noisy::new("a", &log);
    let _b = Noisy::new("b", &log);
} // → ["drop b", "drop a"]（宣言と逆順）

let a = Noisy::new("a", &log);
let _b = Noisy::new("b", &log);
drop(a);  // ここで "drop a"
// スコープ終了で "drop b"  → ["drop a", "drop b"]
\`\`\``,
    hints: [
      "`new` は `Noisy { name: name.to_string(), log: Rc::clone(log) }`。",
      "`impl Drop for Noisy { fn drop(&mut self) { ... } }`",
      '`self.log.borrow_mut().push(format!("drop {}", self.name));`',
    ],
  },
  initialCode: `use std::cell::RefCell;
use std::rc::Rc;

struct Noisy {
    name: String,
    log: Rc<RefCell<Vec<String>>>,
}

impl Noisy {
    fn new(name: &str, log: &Rc<RefCell<Vec<String>>>) -> Noisy {
        todo!()
    }
}

// ここに impl Drop for Noisy を書く

fn new_log() -> Rc<RefCell<Vec<String>>> {
    Rc::new(RefCell::new(Vec::new()))
}
`,
  solutionCode: `use std::cell::RefCell;
use std::rc::Rc;

struct Noisy {
    name: String,
    log: Rc<RefCell<Vec<String>>>,
}

impl Noisy {
    fn new(name: &str, log: &Rc<RefCell<Vec<String>>>) -> Noisy {
        Noisy { name: name.to_string(), log: Rc::clone(log) }
    }
}

impl Drop for Noisy {
    fn drop(&mut self) {
        self.log.borrow_mut().push(format!("drop {}", self.name));
    }
}

fn new_log() -> Rc<RefCell<Vec<String>>> {
    Rc::new(RefCell::new(Vec::new()))
}
`,
});
