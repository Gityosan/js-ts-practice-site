import type { RustGraderDef } from "../../grade/types";

const grader: RustGraderDef = {
  kind: "rust",
  mode: "harness",
  cases: [
    {
      label: "基本",
      expr: 'word_count("the cat the dog")',
      expected: '{"cat": 1, "dog": 1, "the": 2}',
    },
    {
      label: "大文字・記号",
      expr: 'word_count("The cat. the DOG! Cat?")',
      expected: '{"cat": 2, "dog": 1, "the": 2}',
    },
    {
      label: "空・記号だけ",
      expr: '(word_count(""), word_count(" !! ... "))',
      expected: "({}, {})",
    },
    { label: "最多の単語", expr: 'top_word("b a b c a b")', expected: 'Some(("b", 3))' },
    {
      label: "同数なら辞書順で先",
      expr: 'top_word("dog cat dog cat")',
      expected: 'Some(("cat", 2))',
    },
    { label: "空なら None", expr: 'top_word("   ")', expected: "None" },
  ],
};

export default grader;
