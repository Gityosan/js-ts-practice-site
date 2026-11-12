import type { RustGraderDef } from "../../grade/types";

const grader: RustGraderDef = {
  kind: "rust",
  mode: "harness",
  cases: [
    { label: "基本", expr: 'capitalize_words("hello rust world")', expected: '"Hello Rust World"' },
    {
      label: "余分な空白",
      expr: 'capitalize_words("  many   spaces ")',
      expected: '"Many Spaces"',
    },
    {
      label: "2 文字目以降はそのまま",
      expr: 'capitalize_words("iPhone mACBOOK")',
      expected: '"IPhone MACBOOK"',
    },
    { label: "空文字", expr: 'capitalize_words("")', expected: '""' },
    { label: "1 文字の単語", expr: 'capitalize_words("a b c")', expected: '"A B C"' },
    {
      label: "ASCII 以外の小文字",
      expr: 'capitalize_words("élan vital")',
      expected: '"Élan Vital"',
    },
  ],
};

export default grader;
