import type { RustGraderDef } from "../../grade/types";

const grader: RustGraderDef = {
  kind: "rust",
  mode: "harness",
  cases: [
    {
      label: "List の表示",
      expr: 'List(vec!["a".to_string(), "b".to_string(), "c".to_string()]).to_string()',
      expected: '"[a, b, c]"',
    },
    { label: "空の List", expr: "List(vec![]).to_string()", expected: '"[]"' },
    {
      label: "Yen のカンマ",
      expr: "(Yen(0).to_string(), Yen(999).to_string(), Yen(1000).to_string(), Yen(1234567).to_string())",
      expected: '("¥0", "¥999", "¥1,000", "¥1,234,567")',
    },
    { label: "Yen の足し算", expr: "(Yen(500) + Yen(700)).to_string()", expected: '"¥1,200"' },
    {
      label: "Email の検証",
      expr: '(Email::parse("me@example.com").map(|e| e.domain().to_string()), Email::parse("bad@@x").is_none(), Email::parse("@x").is_none(), Email::parse("nobody").is_none())',
      expected: '(Some("example.com"), true, true, true)',
    },
  ],
};

export default grader;
