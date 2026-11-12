import type { RustGraderDef } from "../../grade/types";

const grader: RustGraderDef = {
  kind: "rust",
  mode: "harness",
  cases: [
    {
      label: "文字数でグループ分け",
      expr: 'group_by_len(&["hi", "cat", "yo", "dog", "a"])',
      expected: '[(1, ["a"]), (2, ["hi", "yo"]), (3, ["cat", "dog"])]',
    },
    { label: "空", expr: "group_by_len(&[])", expected: "[]" },
    {
      label: "追加と数",
      expr: '{ let mut inv = Inventory::new(); inv.add("apple", 3); inv.add("apple", 2); inv.add("pen", 1); (inv.count("apple"), inv.count("pen"), inv.count("none")) }',
      expected: "(5, 1, 0)",
    },
    {
      label: "取り出し",
      expr: '{ let mut inv = Inventory::new(); inv.add("apple", 3); (inv.take("apple", 2), inv.take("apple", 5), inv.take("x", 1), inv.count("apple")) }',
      expected: "(true, false, false, 1)",
    },
    {
      label: "0 になったら消える・名前順",
      expr: '{ let mut inv = Inventory::new(); inv.add("pen", 2); inv.add("apple", 1); inv.add("cup", 4); inv.take("apple", 1); inv.items() }',
      expected: '[("cup", 4), ("pen", 2)]',
    },
  ],
};

export default grader;
