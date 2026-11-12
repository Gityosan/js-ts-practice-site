import type { RustGraderDef } from "../../grade/types";

const grader: RustGraderDef = {
  kind: "rust",
  mode: "harness",
  cases: [
    {
      label: "共通要素（重複なし・昇順）",
      expr: "common(&[1, 2, 2, 3, 4], &[4, 2, 6, 2])",
      expected: "[2, 4]",
    },
    { label: "共通なし", expr: "common(&[1, 3], &[2, 4])", expected: "[]" },
    { label: "差集合", expr: "only_in_first(&[5, 1, 2, 3, 1], &[2])", expected: "[1, 3, 5]" },
    {
      label: "重複判定",
      expr: "(all_unique(&[1, 2, 3]), all_unique(&[1, 2, 1]), all_unique(&[]))",
      expected: "(true, false, true)",
    },
    {
      label: "最初に繰り返す文字",
      expr: '(first_repeat("abcbad"), first_repeat("abc"), first_repeat("ああ"))',
      expected: "(Some('b'), None, Some('あ'))",
    },
  ],
};

export default grader;
