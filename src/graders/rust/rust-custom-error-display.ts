import type { RustGraderDef } from "../../grade/types";

const grader: RustGraderDef = {
  kind: "rust",
  mode: "harness",
  cases: [
    {
      label: "正しい名前",
      expr: '(validate("rust_2024"), validate("a"))',
      expected: '(Ok("rust_2024"), Ok("a"))',
    },
    {
      label: "エラーの種類",
      expr: '(validate(""), validate("abcdefghijk"), validate("Rust"), validate("a-b"))',
      expected: "(Err(Empty), Err(TooLong(11)), Err(InvalidChar('R')), Err(InvalidChar('-')))",
    },
    {
      label: "ちょうど 10 文字は OK・文字数で数える",
      expr: '(validate("abcdefghij").is_ok(), validate("あいうえおかきくけこさ"))',
      expected: "(true, Err(TooLong(11)))",
    },
    { label: "Display: 空", expr: "NameError::Empty.to_string()", expected: '"名前が空です"' },
    {
      label: "Display: 長すぎ・不正文字",
      expr: '(format!("{}", NameError::TooLong(12)), validate("x y").unwrap_err().to_string())',
      expected: '("名前が長すぎます（12 文字、最大 10 文字）", "使えない文字があります: \' \'")',
    },
    {
      label: "Error トレイトとして扱える",
      expr: "{ let e: Box<dyn std::error::Error> = Box::new(NameError::Empty); e.to_string() }",
      expected: '"名前が空です"',
    },
  ],
};

export default grader;
