import type { RustGraderDef } from "../../grade/types";

const grader: RustGraderDef = {
  kind: "rust",
  mode: "harness",
  cases: [
    { label: "&str を渡す", expr: 'count_vowels("banana")', expected: "3" },
    { label: "String を渡す", expr: 'count_vowels(String::from("rust"))', expected: "1" },
    { label: "母音なし", expr: 'count_vowels("xyz")', expected: "0" },
    { label: "total_len（&str）", expr: 'total_len(&["ab", "cde"])', expected: "5" },
    {
      label: "total_len（String）",
      expr: 'total_len(&vec![String::from("xyz"), String::new()])',
      expected: "3",
    },
    { label: "with_suffix", expr: 'with_suffix("hi")', expected: '"hi!"' },
  ],
};

export default grader;
