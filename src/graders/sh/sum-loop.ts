import type { CliGraderDef } from "../../grade/types";

const grader: CliGraderDef = {
  kind: "cli",
  runtime: "sh",
  cases: [
    {
      label: "1..5 の合計",
      stdin: "",
      expected: "15",
    },
  ],
};

export default grader;
