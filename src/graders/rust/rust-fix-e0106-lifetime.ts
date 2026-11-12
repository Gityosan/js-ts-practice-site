import type { RustGraderDef } from "../../grade/types";

const grader: RustGraderDef = {
  kind: "rust",
  mode: "harness",
  cases: [
    { label: "長いほう", expr: 'longer("apple", "fig")', expected: '"apple"' },
    { label: "b が長い", expr: 'longer("a", "banana")', expected: '"banana"' },
    { label: "同じなら a", expr: 'longer("ab", "cd")', expected: '"ab"' },
    { label: "最初の単語", expr: 'first_word("hello world").text', expected: '"hello"' },
    { label: "空白なし", expr: 'first_word("rust").text', expected: '"rust"' },
  ],
};

export default grader;
