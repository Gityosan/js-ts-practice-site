import type { CliGraderDef } from "../../grade/types";

const grader: CliGraderDef = {
  kind: "cli",
  runtime: "jq",
  cases: [
    {
      label: "3キー",
      stdin: { config: { b: 1, a: 2, c: 3 } },
      args: ["-r"],
      expected: "a\nb\nc",
    },
    {
      label: "1キー",
      stdin: { config: { x: 1 } },
      args: ["-r"],
      expected: "x",
    },
  ],
};

export default grader;
