import type { RustGraderDef } from "../../grade/types";

const grader: RustGraderDef = {
  kind: "rust",
  mode: "harness",
  cases: [
    { label: "ASCII", expr: 'take_chars("hello", 3)', expected: '"hel"' },
    { label: "日本語", expr: 'take_chars("こんにちは", 2)', expected: '"こん"' },
    { label: "2 バイト文字を含む", expr: 'take_chars("héllo", 2)', expected: '"hé"' },
    { label: "文字数より多い n", expr: 'take_chars("abc", 10)', expected: '"abc"' },
    { label: "n = 0", expr: 'take_chars("abc", 0)', expected: '""' },
    { label: "ちょうど全部", expr: 'take_chars("あいう", 3)', expected: '"あいう"' },
  ],
};

export default grader;
