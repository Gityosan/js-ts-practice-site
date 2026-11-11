import { defineProblem } from "../../../core/schemas";

export default defineProblem({
  id: "rust-cell-try-borrow",
  stage: "write",
  language: "rust",
  scenario: "rust",
  copy: {
    title: "Cell と try_borrow_mut",
    prompt: `## やること

内部可変性の 2 つの道具を使い分けよう。

### 1. Cell でアクセス回数を数える

\`Cache\` は値を返すたびに、\`&self\` のまま **読まれた回数** を数える。

- \`Cache::new(value: String) -> Cache\`
- \`get(&self) -> String\` … 値のコピーを返し、\`reads\` を 1 増やす
- \`reads(&self) -> u32\` … これまで \`get\` された回数

### 2. RefCell の借用を安全に試す

- \`try_push(cell: &RefCell<Vec<i32>>, x: i32) -> Result<usize, String>\` … 可変借用できたら \`x\` を push して **push 後の長さ** を \`Ok\` で返す。すでに借用中で借りられなければ panic せずに \`Err("busy".to_string())\` を返す

\`\`\`rust
let c = Cache::new("hi".to_string());
c.get(); c.get();
c.reads()  // 2

let cell = RefCell::new(vec![1]);
try_push(&cell, 2)          // Ok(2)
let guard = cell.borrow();  // 借用中にすると……
try_push(&cell, 3)          // Err("busy")
\`\`\``,
    hints: [
      "`self.reads.set(self.reads.get() + 1)`",
      "`match cell.try_borrow_mut() { Ok(mut v) => { v.push(x); Ok(v.len()) } Err(_) => Err(...) }`",
      "`borrow_mut()` を使うと借用中に panic してしまう。`try_` 版は Result を返す。",
    ],
  },
  initialCode: `use std::cell::{Cell, RefCell};

struct Cache {
    value: String,
    reads: Cell<u32>,
}

impl Cache {
    fn new(value: String) -> Cache {
        todo!()
    }

    fn get(&self) -> String {
        todo!()
    }

    fn reads(&self) -> u32 {
        todo!()
    }
}

fn try_push(cell: &RefCell<Vec<i32>>, x: i32) -> Result<usize, String> {
    todo!()
}
`,
  solutionCode: `use std::cell::{Cell, RefCell};

struct Cache {
    value: String,
    reads: Cell<u32>,
}

impl Cache {
    fn new(value: String) -> Cache {
        Cache { value, reads: Cell::new(0) }
    }

    fn get(&self) -> String {
        self.reads.set(self.reads.get() + 1);
        self.value.clone()
    }

    fn reads(&self) -> u32 {
        self.reads.get()
    }
}

fn try_push(cell: &RefCell<Vec<i32>>, x: i32) -> Result<usize, String> {
    match cell.try_borrow_mut() {
        Ok(mut v) => {
            v.push(x);
            Ok(v.len())
        }
        Err(_) => Err("busy".to_string()),
    }
}
`,
});
