import type { CliGraderDef } from "../../grade/types";

const grader: CliGraderDef = {
  kind: "cli",
  runtime: "jq",
  cases: [
    {
      label: "1..4",
      stdin: { nums: [1, 2, 3, 4] },
      expected: "10",
    },
    {
      label: "1個",
      stdin: { nums: [7] },
      expected: "7",
    },
    {
      label: "空",
      stdin: { nums: [] },
      expected: "0",
    },
  ],
};

export default grader;
