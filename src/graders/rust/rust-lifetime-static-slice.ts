import type { RustGraderDef } from "../../grade/types";

const grader: RustGraderDef = {
  kind: "rust",
  mode: "harness",
  cases: [
    {
      label: "評価",
      expr: "(grade(95), grade(90), grade(75), grade(50), grade(0))",
      expected: '("A", "A", "B", "C", "F")',
    },
    { label: "一番長い単語", expr: 'longest_word(&["aa", "bbb", "c"])', expected: 'Some("bbb")' },
    { label: "同じ長さは先", expr: 'longest_word(&["ab", "cd", "e"])', expected: 'Some("ab")' },
    { label: "空", expr: "longest_word(&[])", expected: "None" },
    {
      label: "Vec を捨てても使える",
      expr: '{ let w; { let v = vec!["aa", "bbb", "c"]; w = longest_word(&v); } w }',
      expected: 'Some("bbb")',
    },
  ],
};

export default grader;
