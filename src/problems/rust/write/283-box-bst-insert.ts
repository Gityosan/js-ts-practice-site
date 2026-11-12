import { defineProblem } from "../../../core/schemas";

export default defineProblem({
  id: "rust-box-bst-insert",
  stage: "write",
  language: "rust",
  scenario: "rust",
  copy: {
    title: "二分探索木: 挿入と検索",
    prompt: `## やること

\`Option<Box<Node>>\` で子を持つ **二分探索木（BST）** を完成させよう。
BST は「左の子孫はすべて自分より小さく、右の子孫はすべて自分より大きい」木。

\`\`\`rust
struct Node {
    value: i32,
    left: Option<Box<Node>>,
    right: Option<Box<Node>>,
}

struct Bst {
    root: Option<Box<Node>>,
    size: usize,
}
\`\`\`

- \`Bst::new()\` … 空の木
- \`insert(&mut self, v: i32) -> bool\` … 挿入して \`true\`。**すでにある値なら何もせず \`false\`**
- \`contains(&self, v: i32) -> bool\` … 値があるか
- \`len(&self) -> usize\` … 要素数

\`\`\`rust
let mut t = Bst::new();
t.insert(5); t.insert(3); t.insert(8);
t.contains(3) // true
t.contains(4) // false
t.insert(3)   // false（重複）
t.len()       // 3
\`\`\`

## ヒント

可変参照で「次に見る場所」をたどるのがコツ。

\`\`\`rust
let mut cur = &mut self.root;          // &mut Option<Box<Node>>
while let Some(node) = cur {
    // node: &mut Box<Node>
    cur = if v < node.value { &mut node.left } else { &mut node.right };
}
*cur = Some(Box::new(...));           // 空いている場所に置く
\`\`\``,
    hints: [
      "`contains` は `let mut cur = &self.root; while let Some(n) = cur { ... }` で、小さければ左、大きければ右へ進む。",
      "`insert` は重複チェックを `while let` の中で行い、等しければ `return false`。",
      "置けたら `self.size += 1` を忘れずに。再帰関数（`fn insert_at(node: &mut Option<Box<Node>>, v: i32) -> bool`）で書いてもよい。",
    ],
  },
  initialCode: `struct Node {
    value: i32,
    left: Option<Box<Node>>,
    right: Option<Box<Node>>,
}

struct Bst {
    root: Option<Box<Node>>,
    size: usize,
}

impl Bst {
    fn new() -> Self {
        Bst { root: None, size: 0 }
    }

    fn insert(&mut self, v: i32) -> bool {
        todo!()
    }

    fn contains(&self, v: i32) -> bool {
        todo!()
    }

    fn len(&self) -> usize {
        self.size
    }
}
`,
  solutionCode: `struct Node {
    value: i32,
    left: Option<Box<Node>>,
    right: Option<Box<Node>>,
}

struct Bst {
    root: Option<Box<Node>>,
    size: usize,
}

impl Bst {
    fn new() -> Self {
        Bst { root: None, size: 0 }
    }

    fn insert(&mut self, v: i32) -> bool {
        let mut cur = &mut self.root;
        while let Some(node) = cur {
            if v == node.value {
                return false;
            }
            cur = if v < node.value { &mut node.left } else { &mut node.right };
        }
        *cur = Some(Box::new(Node { value: v, left: None, right: None }));
        self.size += 1;
        true
    }

    fn contains(&self, v: i32) -> bool {
        let mut cur = &self.root;
        while let Some(node) = cur {
            if v == node.value {
                return true;
            }
            cur = if v < node.value { &node.left } else { &node.right };
        }
        false
    }

    fn len(&self) -> usize {
        self.size
    }
}
`,
});
