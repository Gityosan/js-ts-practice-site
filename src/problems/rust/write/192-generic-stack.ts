import { defineProblem } from "../../../core/schemas";

export default defineProblem({
  id: "rust-generic-stack",
  stage: "write",
  language: "rust",
  scenario: "rust",
  copy: {
    title: "ジェネリックなスタック Stack<T>",
    prompt: `## やること

どんな型でも積めるスタック \`Stack<T>\` を作ろう。中身は \`Vec<T>\` で持つ。

| メソッド | 動き |
|---|---|
| \`new() -> Stack<T>\` | 空のスタック |
| \`push(&mut self, item: T)\` | 一番上に積む |
| \`pop(&mut self) -> Option<T>\` | 一番上を取り出す（空なら \`None\`） |
| \`peek(&self) -> Option<&T>\` | 一番上を覗く（取り出さない） |
| \`len(&self) -> usize\` | 個数 |
| \`is_empty(&self) -> bool\` | 空かどうか |

\`\`\`rust
let mut s = Stack::new();
s.push(1);
s.push(2);
s.pop()   // Some(2)
s.peek()  // Some(&1)
\`\`\`

\`Vec\` の \`push\` / \`pop\` / \`last\` / \`len\` / \`is_empty\` に任せればよい。`,
    hints: [
      "`impl<T> Stack<T> { ... }` の中に全部書く",
      "`new` は `Stack { items: Vec::new() }`",
      "`peek` は `self.items.last()` がそのまま `Option<&T>` を返す",
    ],
  },
  initialCode: `struct Stack<T> {
    items: Vec<T>,
}

impl<T> Stack<T> {
    fn new() -> Stack<T> {
        todo!()
    }

    fn push(&mut self, item: T) {
        todo!()
    }

    fn pop(&mut self) -> Option<T> {
        todo!()
    }

    fn peek(&self) -> Option<&T> {
        todo!()
    }

    fn len(&self) -> usize {
        todo!()
    }

    fn is_empty(&self) -> bool {
        todo!()
    }
}
`,
  solutionCode: `struct Stack<T> {
    items: Vec<T>,
}

impl<T> Stack<T> {
    fn new() -> Stack<T> {
        Stack { items: Vec::new() }
    }

    fn push(&mut self, item: T) {
        self.items.push(item);
    }

    fn pop(&mut self) -> Option<T> {
        self.items.pop()
    }

    fn peek(&self) -> Option<&T> {
        self.items.last()
    }

    fn len(&self) -> usize {
        self.items.len()
    }

    fn is_empty(&self) -> bool {
        self.items.is_empty()
    }
}
`,
});
