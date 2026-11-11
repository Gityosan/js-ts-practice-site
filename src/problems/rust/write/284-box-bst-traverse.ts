import { defineProblem } from "../../../core/schemas";

export default defineProblem({
  id: "rust-box-bst-traverse",
  stage: "write",
  language: "rust",
  scenario: "rust",
  copy: {
    title: "二分探索木: 走査と高さ",
    prompt: `## やること

二分探索木の \`insert\` は用意してある。木をたどる 3 つの関数を **再帰** で書こう。引数は \`&Option<Box<Node>>\`（部分木）。

- \`inorder(node: &Option<Box<Node>>) -> Vec<i32>\` … 中間順（左 → 自分 → 右）で値を並べる。BST なら昇順になる
- \`height(node: &Option<Box<Node>>) -> usize\` … 木の高さ。空なら 0、ノード 1 個なら 1
- \`sum(node: &Option<Box<Node>>) -> i32\` … 全ノードの合計

\`\`\`rust
let mut root = None;
for v in [5, 3, 8, 1] { insert(&mut root, v); }
inorder(&root) // [1, 3, 5, 8]
height(&root)  // 3   （5 → 3 → 1）
sum(&root)     // 17
\`\`\``,
    hints: [
      "どれも `match node { None => ..., Some(n) => ... }` で場合分けする。",
      "`inorder`: 左の結果の Vec に自分の値を push し、右の結果を `extend` する。",
      "`height`: `1 + height(&n.left).max(height(&n.right))`。",
    ],
  },
  initialCode: `struct Node {
    value: i32,
    left: Option<Box<Node>>,
    right: Option<Box<Node>>,
}

fn insert(node: &mut Option<Box<Node>>, v: i32) {
    match node {
        None => *node = Some(Box::new(Node { value: v, left: None, right: None })),
        Some(n) => {
            if v < n.value {
                insert(&mut n.left, v)
            } else if v > n.value {
                insert(&mut n.right, v)
            }
        }
    }
}

fn build(values: &[i32]) -> Option<Box<Node>> {
    let mut root = None;
    for &v in values {
        insert(&mut root, v);
    }
    root
}

fn inorder(node: &Option<Box<Node>>) -> Vec<i32> {
    todo!()
}

fn height(node: &Option<Box<Node>>) -> usize {
    todo!()
}

fn sum(node: &Option<Box<Node>>) -> i32 {
    todo!()
}
`,
  solutionCode: `struct Node {
    value: i32,
    left: Option<Box<Node>>,
    right: Option<Box<Node>>,
}

fn insert(node: &mut Option<Box<Node>>, v: i32) {
    match node {
        None => *node = Some(Box::new(Node { value: v, left: None, right: None })),
        Some(n) => {
            if v < n.value {
                insert(&mut n.left, v)
            } else if v > n.value {
                insert(&mut n.right, v)
            }
        }
    }
}

fn build(values: &[i32]) -> Option<Box<Node>> {
    let mut root = None;
    for &v in values {
        insert(&mut root, v);
    }
    root
}

fn inorder(node: &Option<Box<Node>>) -> Vec<i32> {
    match node {
        None => vec![],
        Some(n) => {
            let mut out = inorder(&n.left);
            out.push(n.value);
            out.extend(inorder(&n.right));
            out
        }
    }
}

fn height(node: &Option<Box<Node>>) -> usize {
    match node {
        None => 0,
        Some(n) => 1 + height(&n.left).max(height(&n.right)),
    }
}

fn sum(node: &Option<Box<Node>>) -> i32 {
    match node {
        None => 0,
        Some(n) => n.value + sum(&n.left) + sum(&n.right),
    }
}
`,
});
