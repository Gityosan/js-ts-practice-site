import type { RustGraderDef } from "../../grade/types";

const grader: RustGraderDef = {
  kind: "rust",
  mode: "harness",
  cases: [
    { label: "面積", expr: '(area("3x4"), area(" 10 x 2 "))', expected: "(Ok(12), Ok(20))" },
    { label: "形式エラー", expr: 'area("3*4")', expected: "Err(Format)" },
    {
      label: "数値エラーは Parse に包まれる",
      expr: '(area("3x"), area("ax4"))',
      expected:
        "(Err(Parse(ParseIntError { kind: Empty })), Err(Parse(ParseIntError { kind: InvalidDigit })))",
    },
    { label: "0 は不可", expr: 'parse_dims("0x5")', expected: "Err(Zero)" },
    {
      label: "合計",
      expr: '(total_area(&["1x1", "2x3"]), total_area(&[]))',
      expected: "(Ok(7), Ok(0))",
    },
    { label: "合計中のエラー", expr: 'total_area(&["1x1", "2x0", "x"])', expected: "Err(Zero)" },
    {
      label: "Display",
      expr: '[area("3*4").unwrap_err().to_string(), area("3xz").unwrap_err().to_string(), area("0x1").unwrap_err().to_string()]',
      expected:
        '["形式は 幅x高さ です", "数値ではありません: invalid digit found in string", "0 は指定できません"]',
    },
  ],
};

export default grader;
