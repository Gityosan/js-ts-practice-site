import type { RustGraderDef } from "../../grade/types";

const grader: RustGraderDef = {
  kind: "rust",
  mode: "harness",
  cases: [
    { label: "偶数の二乗和", expr: "sum_even_squares(&[1, 2, 3, 4])", expected: "20" },
    { label: "負の偶数も", expr: "sum_even_squares(&[-2, 5, 6])", expected: "40" },
    { label: "空", expr: "sum_even_squares(&[])", expected: "0" },
    { label: "単語の長さ", expr: 'word_lengths("the quick  brown fox")', expected: "[3, 5, 5, 3]" },
    { label: "日本語は文字数で", expr: 'word_lengths("こんにちは 世界")', expected: "[5, 2]" },
    {
      label: "長い単語を大文字に",
      expr: 'shout_long(&["a", "rust", "go", "zig"], 3)',
      expected: '["RUST", "ZIG"]',
    },
  ],
};

export default grader;
