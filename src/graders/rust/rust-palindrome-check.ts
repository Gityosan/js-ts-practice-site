import type { RustGraderDef } from "../../grade/types";

const grader: RustGraderDef = {
  kind: "rust",
  mode: "harness",
  cases: [
    { label: "単純な回文", expr: 'is_palindrome("racecar")', expected: "true" },
    {
      label: "記号・大文字を無視",
      expr: 'is_palindrome("A man, a plan, a canal: Panama")',
      expected: "true",
    },
    { label: "回文でない", expr: 'is_palindrome("hello")', expected: "false" },
    { label: "空文字", expr: 'is_palindrome("")', expected: "true" },
    { label: "日本語", expr: 'is_palindrome("たけやぶやけた")', expected: "true" },
    {
      label: "数字",
      expr: '(is_palindrome("12321"), is_palindrome("123"))',
      expected: "(true, false)",
    },
  ],
};

export default grader;
