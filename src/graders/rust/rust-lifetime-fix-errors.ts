import type { RustGraderDef } from "../../grade/types";

const grader: RustGraderDef = {
  kind: "rust",
  mode: "harness",
  cases: [
    { label: "pick true", expr: 'pick(true, "x", "y")', expected: '"x"' },
    { label: "pick false", expr: 'pick(false, "x", "y")', expected: '"y"' },
    { label: "first_word", expr: 'first_word("hello world")', expected: '"hello"' },
    { label: "first_word（空白なし）", expr: 'first_word("rust")', expected: '"rust"' },
    { label: "greeting", expr: 'greeting("Ann")', expected: '"Hello, Ann"' },
  ],
};

export default grader;
