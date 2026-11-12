import type { RustGraderDef } from "../../grade/types";

const grader: RustGraderDef = {
  kind: "rust",
  mode: "harness",
  cases: [
    { label: "&str を渡せる", expr: 'count_chars("hello")', expected: "5" },
    { label: "日本語も文字数で数える", expr: 'count_chars("こんにちは")', expected: "5" },
    { label: "describe", expr: 'describe(String::from("Rust"))', expected: '"Rust は 4 文字"' },
    { label: "空文字", expr: "describe(String::new())", expected: '" は 0 文字"' },
  ],
};

export default grader;
