import type { RustGraderDef } from "../../grade/types";

const grader: RustGraderDef = {
  kind: "rust",
  mode: "harness",
  cases: [
    {
      label: "Stats::default",
      expr: "Stats::default()",
      expected: 'Stats { count: 0, total: 0, label: "" }',
    },
    {
      label: "Config::default",
      expr: "Config::default()",
      expected: 'Config { name: "app", port: 8080, verbose: false, retries: 3 }',
    },
    {
      label: "dev_config",
      expr: "dev_config()",
      expected: 'Config { name: "app", port: 3000, verbose: true, retries: 3 }',
    },
    {
      label: "型注釈から default",
      expr: "{ let c: Config = Default::default(); c.retries }",
      expected: "3",
    },
  ],
};

export default grader;
