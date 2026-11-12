import type { RustGraderDef } from "../../grade/types";

const grader: RustGraderDef = {
  kind: "rust",
  mode: "harness",
  cases: [
    { label: "Rust", expr: 'make_greeting("Rust")', expected: '"Hello, Rust!"' },
    { label: "日本語", expr: 'make_greeting("世界")', expected: '"Hello, 世界!"' },
    { label: "空文字", expr: 'make_greeting("")', expected: '"Hello, !"' },
    {
      label: "戻り値は String",
      expr: '{ let s: String = make_greeting("A"); s.len() }',
      expected: "9",
    },
  ],
};

export default grader;
