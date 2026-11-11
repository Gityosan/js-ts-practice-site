import type { RustGraderDef } from "../../grade/types";

const grader: RustGraderDef = {
  kind: "rust",
  mode: "harness",
  cases: [
    { label: "基本", expr: 'count_vowels("Hello World")', expected: "3" },
    { label: "母音なし", expr: 'count_vowels("rhythm")', expected: "0" },
    { label: "大文字も数える", expr: 'count_vowels("AEIOU aeiou")', expected: "10" },
    { label: "空文字", expr: 'count_vowels("")', expected: "0" },
    { label: "ASCII の長さ", expr: 'lengths("hello")', expected: "(5, 5)" },
    { label: "日本語の長さ", expr: 'lengths("こんにちは")', expected: "(15, 5)" },
  ],
};

export default grader;
