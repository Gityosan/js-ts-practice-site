import type { CliGraderDef } from "../../grade/types";

const grader: CliGraderDef = {
  kind: "cli",
  runtime: "jq",
  cases: [
    {
      label: "2キー",
      stdin: { scores: { math: 80, eng: 90 } },
      args: ["-r"],
      expected: "math=80\neng=90",
    },
    {
      label: "1キー",
      stdin: { scores: { only: 5 } },
      args: ["-r"],
      expected: "only=5",
    },
  ],
};

export default grader;
