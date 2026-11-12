import type { RustGraderDef } from "../../grade/types";

const grader: RustGraderDef = {
  kind: "rust",
  mode: "harness",
  cases: [
    { label: "空の木には何もない", expr: "Bst::new().contains(1)", expected: "false" },
    {
      label: "挿入した値は見つかる",
      expr: "{ let mut t = Bst::new(); for v in [5, 3, 8, 1, 4] { t.insert(v); } (t.contains(1), t.contains(4), t.contains(8)) }",
      expected: "(true, true, true)",
    },
    {
      label: "ない値は見つからない",
      expr: "{ let mut t = Bst::new(); for v in [5, 3, 8] { t.insert(v); } (t.contains(2), t.contains(9)) }",
      expected: "(false, false)",
    },
    {
      label: "重複は false",
      expr: "{ let mut t = Bst::new(); (t.insert(5), t.insert(5), t.insert(-2)) }",
      expected: "(true, false, true)",
    },
    {
      label: "要素数",
      expr: "{ let mut t = Bst::new(); for v in [5, 3, 8, 3, 5, 10] { t.insert(v); } t.len() }",
      expected: "4",
    },
  ],
};

export default grader;
