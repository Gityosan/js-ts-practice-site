import type { RustGraderDef } from "../../grade/types";

const grader: RustGraderDef = {
  kind: "rust",
  mode: "harness",
  cases: [
    {
      label: "レシート 2 品",
      expr: 'receipt(&[("pen", 120), ("note", 300)])',
      expected: '"pen   |  120\\nnote  |  300\\nTOTAL |  420\\n"',
    },
    { label: "空のレシート", expr: "receipt(&[])", expected: '"TOTAL |    0\\n"' },
    {
      label: "Debug で token を隠す",
      expr: 'format!("{:?}", Secret { user: "alice".to_string(), token: "abc123".to_string() })',
      expected: '"Secret { user: \\"alice\\", token: \\"***\\" }"',
    },
    {
      label: "{:#?} でも整形される",
      expr: 'format!("{:#?}", Secret { user: "bob".to_string(), token: "x".to_string() }).lines().count()',
      expected: "4",
    },
  ],
};

export default grader;
