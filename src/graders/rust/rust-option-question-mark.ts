import type { RustGraderDef } from "../../grade/types";

const grader: RustGraderDef = {
  kind: "rust",
  mode: "harness",
  cases: [
    {
      label: "最後の単語の頭文字",
      expr: '(first_char_of_last_word("hello rust world"), first_char_of_last_word("solo"))',
      expected: "(Some('w'), Some('s'))",
    },
    { label: "単語なし", expr: 'first_char_of_last_word("   ")', expected: "None" },
    { label: "先頭 2 つを足す", expr: 'add_first_two(&["3", "4", "x"])', expected: "Some(7)" },
    {
      label: "足りない・数値でない",
      expr: '(add_first_two(&["3"]), add_first_two(&["3", "four"]), add_first_two(&[]))',
      expected: "(None, None, None)",
    },
    { label: "イニシャル", expr: 'initials("Taro Yamada")', expected: 'Some("T.Y.")' },
    {
      label: "単語数が違う",
      expr: '(initials("Cher"), initials("A B C"))',
      expected: "(None, None)",
    },
  ],
};

export default grader;
