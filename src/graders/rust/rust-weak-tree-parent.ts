import type { RustGraderDef } from "../../grade/types";

const grader: RustGraderDef = {
  kind: "rust",
  mode: "harness",
  cases: [
    {
      label: "親の値",
      expr: "{ let root = Node::new(1); let c = add_child(&root, 2); parent_value(&c) }",
      expected: "Some(1)",
    },
    { label: "根には親がいない", expr: "parent_value(&Node::new(1))", expected: "None" },
    {
      label: "子が登録される",
      expr: "{ let root = Node::new(1); add_child(&root, 2); add_child(&root, 3); let v: Vec<i32> = root.children.borrow().iter().map(|c| c.value).collect(); v }",
      expected: "[2, 3]",
    },
    {
      label: "根までの道",
      expr: "{ let root = Node::new(1); let c = add_child(&root, 2); let g = add_child(&c, 3); path_to_root(&g) }",
      expected: "[3, 2, 1]",
    },
    {
      label: "Weak は強い参照に数えない",
      expr: "{ let root = Node::new(1); let _c = add_child(&root, 2); (Rc::strong_count(&root), Rc::weak_count(&root)) }",
      expected: "(1, 1)",
    },
    {
      label: "親が消えたら None",
      expr: "{ let child; { let root = Node::new(1); child = add_child(&root, 2); } parent_value(&child) }",
      expected: "None",
    },
  ],
};

export default grader;
