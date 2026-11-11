import type { RustGraderDef } from "../../grade/types";

const grader: RustGraderDef = {
  kind: "rust",
  mode: "harness",
  cases: [
    { label: "2 単語", expr: 'first_word("hello world")', expected: '"hello"' },
    { label: "1 単語", expr: 'first_word("rust")', expected: '"rust"' },
    { label: "先頭がスペース", expr: 'first_word(" lead")', expected: '""' },
    { label: "空文字", expr: 'first_word("")', expected: '""' },
    { label: "日本語を含む", expr: 'first_word("こんにちは 世界")', expected: '"こんにちは"' },
    {
      label: "String から借用",
      expr: '{ let s = String::from("a b c"); first_word(&s).to_string() }',
      expected: '"a"',
    },
  ],
};

export default grader;
