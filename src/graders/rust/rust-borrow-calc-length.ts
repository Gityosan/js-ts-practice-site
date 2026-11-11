import type { RustGraderDef } from "../../grade/types";

const grader: RustGraderDef = {
  kind: "rust",
  mode: "harness",
  cases: [
    { label: "バイト数", expr: 'byte_len(&String::from("banana"))', expected: "6" },
    { label: "日本語はバイト数が 3 倍", expr: 'byte_len(&String::from("あい"))', expected: "6" },
    { label: "a を数える", expr: "count_char(&String::from(\"banana\"), 'a')", expected: "3" },
    { label: "見つからない", expr: "count_char(&String::from(\"banana\"), 'z')", expected: "0" },
    {
      label: "呼んだ後も元の String が使える",
      expr: "{ let s = String::from(\"hello\"); let n = byte_len(&s); let k = count_char(&s, 'l'); (s, n, k) }",
      expected: '("hello", 5, 2)',
    },
  ],
};

export default grader;
