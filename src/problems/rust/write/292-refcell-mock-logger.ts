import { defineProblem } from "../../../core/schemas";

export default defineProblem({
  id: "rust-refcell-mock-logger",
  stage: "write",
  language: "rust",
  scenario: "rust",
  copy: {
    title: "RefCell で記録するモック",
    prompt: `## やること

\`Logger\` トレイトは \`&self\` しか受け取らない。テスト用に、受け取ったメッセージを **内部に記録する** \`MockLogger\` を作ろう。

\`\`\`rust
trait Logger {
    fn log(&self, msg: &str);
}
\`\`\`

- \`MockLogger::new()\` … 空の記録で作る
- \`impl Logger for MockLogger\` … \`log\` で \`msg\` を記録に追加
- \`MockLogger::messages(&self) -> Vec<String>\` … 記録のコピーを返す
- \`process(items: &[i32], logger: &dyn Logger) -> i32\` … 正の数だけ合計して返す。負の数を見つけたら \`"skip -3"\` のように \`skip <値>\` をログに出す。最後に \`"sum 7"\` のように \`sum <合計>\` をログに出す

\`\`\`rust
let logger = MockLogger::new();
process(&[3, -1, 4], &logger)  // 7
logger.messages()              // ["skip -1", "sum 7"]
\`\`\`

\`&self\` から中身を変更するために、フィールドを \`RefCell<Vec<String>>\` にする（構造体定義は用意済み）。`,
    hints: [
      "`self.messages.borrow_mut().push(msg.to_string())`",
      "`messages()` は `self.messages.borrow().clone()`。",
      '`process` の中では `logger.log(&format!("skip {}", x))` のように呼ぶ。0 は「正の数」ではないので合計にもログにも含めない。',
    ],
  },
  initialCode: `use std::cell::RefCell;

trait Logger {
    fn log(&self, msg: &str);
}

struct MockLogger {
    messages: RefCell<Vec<String>>,
}

impl MockLogger {
    fn new() -> Self {
        todo!()
    }

    fn messages(&self) -> Vec<String> {
        todo!()
    }
}

impl Logger for MockLogger {
    fn log(&self, msg: &str) {
        todo!()
    }
}

fn process(items: &[i32], logger: &dyn Logger) -> i32 {
    todo!()
}
`,
  solutionCode: `use std::cell::RefCell;

trait Logger {
    fn log(&self, msg: &str);
}

struct MockLogger {
    messages: RefCell<Vec<String>>,
}

impl MockLogger {
    fn new() -> Self {
        MockLogger { messages: RefCell::new(Vec::new()) }
    }

    fn messages(&self) -> Vec<String> {
        self.messages.borrow().clone()
    }
}

impl Logger for MockLogger {
    fn log(&self, msg: &str) {
        self.messages.borrow_mut().push(msg.to_string());
    }
}

fn process(items: &[i32], logger: &dyn Logger) -> i32 {
    let mut sum = 0;
    for &x in items {
        if x > 0 {
            sum += x;
        } else if x < 0 {
            logger.log(&format!("skip {}", x));
        }
    }
    logger.log(&format!("sum {}", sum));
    sum
}
`,
});
