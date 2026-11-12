import type { RustGraderDef } from "../../grade/types";

const grader: RustGraderDef = {
  kind: "rust",
  mode: "harness",
  cases: [
    { label: "* で参照外し", expr: "*MyBox::new(5)", expected: "5" },
    {
      label: "&MyBox<String> → &str",
      expr: 'greet(&MyBox::new(String::from("Rust")))',
      expected: '"Hello, Rust!"',
    },
    { label: "中身のメソッドを呼ぶ", expr: 'MyBox::new(String::from("abc")).len()', expected: "3" },
    {
      label: "&MyBox<Vec<i32>> → &[i32]",
      expr: "total(&MyBox::new(vec![1, 2, 3]))",
      expected: "6",
    },
    { label: "入れ子", expr: "**MyBox::new(MyBox::new('z'))", expected: "'z'" },
  ],
};

export default grader;
