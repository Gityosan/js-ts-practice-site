import type { RustGraderDef } from "../../grade/types";

const grader: RustGraderDef = {
  kind: "rust",
  mode: "harness",
  cases: [
    { label: "範囲内", expr: "Percent::try_from(50)", expected: "Ok(Percent(50))" },
    {
      label: "境界 0 と 100",
      expr: "(Percent::try_from(0), Percent::try_from(100))",
      expected: "(Ok(Percent(0)), Ok(Percent(100)))",
    },
    { label: "大きすぎ", expr: "Percent::try_from(150)", expected: 'Err("out of range: 150")' },
    {
      label: "負",
      expr: "{ let p: Result<Percent, String> = (-1).try_into(); p }",
      expected: 'Err("out of range: -1")',
    },
    {
      label: "to_u8",
      expr: "(to_u8(255), to_u8(256), to_u8(-1))",
      expected: "(Some(255), None, None)",
    },
  ],
};

export default grader;
