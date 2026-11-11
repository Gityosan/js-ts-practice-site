import type { RustGraderDef } from "../../grade/types";

const grader: RustGraderDef = {
  kind: "rust",
  mode: "harness",
  cases: [
    {
      label: "末尾に追加",
      expr: '{ let mut s = String::from("file"); add_suffix(&mut s, ".txt"); s }',
      expected: '"file.txt"',
    },
    {
      label: "空文字を追加",
      expr: '{ let mut s = String::from("a"); add_suffix(&mut s, ""); s }',
      expected: '"a"',
    },
    {
      label: "2 回追加",
      expr: '{ let mut s = String::new(); add_suffix(&mut s, "ab"); add_suffix(&mut s, "cd"); s }',
      expected: '"abcd"',
    },
    {
      label: "切り詰め",
      expr: '{ let mut s = String::from("abcdef"); truncate_to(&mut s, 3); s }',
      expected: '"abc"',
    },
    {
      label: "短ければそのまま",
      expr: '{ let mut s = String::from("ab"); truncate_to(&mut s, 5); s }',
      expected: '"ab"',
    },
    {
      label: "0 にすると空",
      expr: '{ let mut s = String::from("xyz"); truncate_to(&mut s, 0); s }',
      expected: '""',
    },
  ],
};

export default grader;
