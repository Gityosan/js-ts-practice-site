import type { RustGraderDef } from "../../grade/types";

const grader: RustGraderDef = {
  kind: "rust",
  mode: "harness",
  cases: [
    {
      label: "重複除去",
      expr: "{ let mut v = vec![3, 1, 3, 2, 1, 3]; unique_sorted(&mut v); v }",
      expected: "[1, 2, 3]",
    },
    {
      label: "負の数を除く（順序は保つ）",
      expr: "{ let mut v = vec![4, -1, 0, -7, 2]; remove_negatives(&mut v); v }",
      expected: "[4, 0, 2]",
    },
    {
      label: "降順",
      expr: "{ let mut v = vec![2, 9, -3, 5]; sort_desc(&mut v); v }",
      expected: "[9, 5, 2, -3]",
    },
    {
      label: "長さ順→辞書順",
      expr: '{ let mut v: Vec<String> = ["pear", "fig", "apple", "kiwi", "ab"].iter().map(|s| s.to_string()).collect(); sort_words(&mut v); v }',
      expected: '["ab", "fig", "kiwi", "pear", "apple"]',
    },
    {
      label: "位置",
      expr: "(position_of(&[5, 6, 7, 6], 6), position_of(&[5], 9))",
      expected: "(Some(1), None)",
    },
    {
      label: "全部含むか",
      expr: "(has_all(&[1, 2, 3], &[3, 1]), has_all(&[1, 2], &[2, 4]), has_all(&[1], &[]))",
      expected: "(true, false, true)",
    },
  ],
};

export default grader;
