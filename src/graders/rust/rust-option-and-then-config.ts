import type { RustGraderDef } from "../../grade/types";

const grader: RustGraderDef = {
  kind: "rust",
  mode: "harness",
  cases: [
    { label: "port（正常）", expr: 'port(&[("port", "3000")])', expected: "3000" },
    {
      label: "port（無い・数でない・小さい）",
      expr: '(port(&[]), port(&[("port", "abc")]), port(&[("port", "80")]))',
      expected: "(8080, 8080, 8080)",
    },
    {
      label: "timeout_ms",
      expr: '(timeout_ms(&[("timeout", "5")]), timeout_ms(&[("timeout", "x")]), timeout_ms(&[]))',
      expected: "(Some(5000), None, None)",
    },
    { label: "app_name（空白を除く）", expr: 'app_name(&[("name", " app ")])', expected: '"app"' },
    {
      label: "app_name（空・無い）",
      expr: '(app_name(&[("name", "   ")]), app_name(&[("port", "1")]))',
      expected: '("unknown", "unknown")',
    },
  ],
};

export default grader;
