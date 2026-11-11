import { defineProblem } from "../../../core/schemas";

export default defineProblem({
  id: "rust-weak-tree-parent",
  stage: "write",
  language: "rust",
  scenario: "rust",
  copy: {
    title: "Weak で親を指す木",
    prompt: `## やること

親は子を \`Rc\` で **所有** し、子は親を \`Weak\` で **所有せずに** 指す木を作ろう。

\`\`\`rust
struct Node {
    value: i32,
    parent: RefCell<Weak<Node>>,
    children: RefCell<Vec<Rc<Node>>>,
}
\`\`\`

- \`Node::new(value: i32) -> Rc<Node>\` … 親なし・子なしのノード（用意済み）
- \`add_child(parent: &Rc<Node>, value: i32) -> Rc<Node>\` … 新しい子を作り、親の \`children\` に追加し、子の \`parent\` に親の \`Weak\` を設定して、子を返す
- \`parent_value(node: &Node) -> Option<i32>\` … 親が生きていればその値、いなければ \`None\`
- \`path_to_root(node: &Rc<Node>) -> Vec<i32>\` … 自分から根までの値を順に並べる

\`\`\`rust
let root = Node::new(1);
let child = add_child(&root, 2);
let grandchild = add_child(&child, 3);
parent_value(&grandchild)   // Some(2)
path_to_root(&grandchild)   // [3, 2, 1]
Rc::strong_count(&root)     // 1（子は Weak なので数えない）
Rc::weak_count(&root)       // 1
\`\`\``,
    hints: [
      "`*child.parent.borrow_mut() = Rc::downgrade(parent);` と `parent.children.borrow_mut().push(Rc::clone(&child));`",
      "`parent_value` は `node.parent.borrow().upgrade().map(|p| p.value)`。",
      "`path_to_root` は `let mut cur = Rc::clone(node);` から始め、`upgrade()` が `Some` の間たどる。",
    ],
  },
  initialCode: `use std::cell::RefCell;
use std::rc::{Rc, Weak};

struct Node {
    value: i32,
    parent: RefCell<Weak<Node>>,
    children: RefCell<Vec<Rc<Node>>>,
}

impl Node {
    fn new(value: i32) -> Rc<Node> {
        Rc::new(Node {
            value,
            parent: RefCell::new(Weak::new()),
            children: RefCell::new(Vec::new()),
        })
    }
}

fn add_child(parent: &Rc<Node>, value: i32) -> Rc<Node> {
    todo!()
}

fn parent_value(node: &Node) -> Option<i32> {
    todo!()
}

fn path_to_root(node: &Rc<Node>) -> Vec<i32> {
    todo!()
}
`,
  solutionCode: `use std::cell::RefCell;
use std::rc::{Rc, Weak};

struct Node {
    value: i32,
    parent: RefCell<Weak<Node>>,
    children: RefCell<Vec<Rc<Node>>>,
}

impl Node {
    fn new(value: i32) -> Rc<Node> {
        Rc::new(Node {
            value,
            parent: RefCell::new(Weak::new()),
            children: RefCell::new(Vec::new()),
        })
    }
}

fn add_child(parent: &Rc<Node>, value: i32) -> Rc<Node> {
    let child = Node::new(value);
    *child.parent.borrow_mut() = Rc::downgrade(parent);
    parent.children.borrow_mut().push(Rc::clone(&child));
    child
}

fn parent_value(node: &Node) -> Option<i32> {
    node.parent.borrow().upgrade().map(|p| p.value)
}

fn path_to_root(node: &Rc<Node>) -> Vec<i32> {
    let mut out = vec![node.value];
    let mut cur = Rc::clone(node);
    loop {
        let parent = cur.parent.borrow().upgrade();
        match parent {
            Some(p) => {
                out.push(p.value);
                cur = p;
            }
            None => break,
        }
    }
    out
}
`,
});
