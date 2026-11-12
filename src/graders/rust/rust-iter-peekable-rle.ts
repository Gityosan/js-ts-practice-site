import type { RustGraderDef } from "../../grade/types";

const grader: RustGraderDef = {
  kind: "rust",
  mode: "harness",
  cases: [
    { label: "runs", expr: 'runs("aaabcc")', expected: "[('a', 3), ('b', 1), ('c', 2)]" },
    {
      label: "runs（同じ文字が離れている）",
      expr: 'runs("abba")',
      expected: "[('a', 1), ('b', 2), ('a', 1)]",
    },
    { label: "runs（空）", expr: 'runs("")', expected: "[]" },
    { label: "encode", expr: 'encode("aaabcc")', expected: '"a3b1c2"' },
    { label: "encode（日本語）", expr: 'encode("ああいいい")', expected: '"あ2い3"' },
    { label: "encode（空）", expr: 'encode("")', expected: '""' },
  ],
};

export default grader;
