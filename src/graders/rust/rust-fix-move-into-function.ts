import type { RustGraderDef } from "../../grade/types";

const grader: RustGraderDef = {
  kind: "rust",
  mode: "harness",
  cases: [
    { label: "Rust", expr: 'describe(String::from("Rust"))', expected: '"Rust (4)"' },
    { label: "日本語", expr: 'describe(String::from("所有権"))', expected: '"所有権 (3)"' },
    { label: "空文字", expr: "describe(String::new())", expected: '" (0)"' },
  ],
};

export default grader;
