import type { RustGraderDef } from "../../grade/types";

const grader: RustGraderDef = {
  kind: "rust",
  mode: "harness",
  cases: [
    {
      label: "基本",
      expr: 'top_words("The cat and the hat. The END!", 2)',
      expected: '[("the", 3), ("and", 1)]',
    },
    {
      label: "同数は辞書順",
      expr: 'top_words("b a c b a", 3)',
      expected: '[("a", 2), ("b", 2), ("c", 1)]',
    },
    {
      label: "記号や数字の扱い",
      expr: 'top_words("rust2024, Rust2024; go-go", 5)',
      expected: '[("go", 2), ("rust2024", 2)]',
    },
    { label: "空の文章", expr: 'top_words("", 3)', expected: "[]" },
    { label: "n = 0", expr: 'top_words("a a a", 0)', expected: "[]" },
  ],
};

export default grader;
