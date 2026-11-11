import type { RustGraderDef } from "../../grade/types";

const grader: RustGraderDef = {
  kind: "rust",
  mode: "harness",
  cases: [
    {
      label: "式を分解",
      expr: 'tokenize("x = 12 * (y + 3)")',
      expected:
        "Ok([Ident(\"x\"), Op('='), Num(12), Op('*'), LParen, Ident(\"y\"), Op('+'), Num(3), RParen])",
    },
    {
      label: "空白なしでも区切れる",
      expr: 'tokenize("a1+_b2/40")',
      expected: "Ok([Ident(\"a1\"), Op('+'), Ident(\"_b2\"), Op('/'), Num(40)])",
    },
    { label: "空文字", expr: 'tokenize("   ")', expected: "Ok([])" },
    {
      label: "不明な文字",
      expr: 'tokenize("1 + $")',
      expected: "Err(\"不明な文字 '$' (位置 4)\")",
    },
    { label: "数のすぐ後の識別子", expr: 'tokenize("3x")', expected: 'Ok([Num(3), Ident("x")])' },
  ],
};

export default grader;
