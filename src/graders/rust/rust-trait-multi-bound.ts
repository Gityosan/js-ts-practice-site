import type { RustGraderDef } from "../../grade/types";

const grader: RustGraderDef = {
  kind: "rust",
  mode: "harness",
  cases: [
    { label: "整数の最大", expr: "max_label(&[3, 9, 4])", expected: '"max = 9"' },
    { label: "文字列の最大", expr: 'max_label(&["pear", "apple"])', expected: '"max = pear"' },
    {
      label: "String（Copy でない）",
      expr: 'max_label(&[String::from("b"), String::from("c"), String::from("a")])',
      expected: '"max = c"',
    },
    { label: "空", expr: "max_label::<i32>(&[])", expected: '"empty"' },
    { label: "labeled（&str）", expr: 'labeled("x", "y")', expected: '"x / \\"y\\""' },
    { label: "labeled（Vec）", expr: "labeled(1.5, vec![1, 2])", expected: '"1.5 / [1, 2]"' },
  ],
};

export default grader;
