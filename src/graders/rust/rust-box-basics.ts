import type { RustGraderDef } from "../../grade/types";

const grader: RustGraderDef = {
  kind: "rust",
  mode: "harness",
  cases: [
    { label: "Box に入れる", expr: "boxed(5)", expected: "5" },
    { label: "中身を参照外し", expr: "*boxed(-7) * 2", expected: "-14" },
    { label: "2 つの Box を足す", expr: "add_boxes(boxed(2), boxed(3))", expected: "5" },
    { label: "負の数", expr: "add_boxes(Box::new(-10), Box::new(4))", expected: "-6" },
    {
      label: "String を取り出す",
      expr: 'unbox_string(Box::new(String::from("hi")))',
      expected: '"hi"',
    },
  ],
};

export default grader;
