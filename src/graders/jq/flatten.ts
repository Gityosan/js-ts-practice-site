import type { CliGraderDef } from "../../grade/types";

const grader: CliGraderDef = {
  kind: "cli",
  runtime: "jq",
  cases: [
    {
      label: "3グループ",
      stdin: { matrix: [[1, 2], [3], [4, 5]] },
      args: ["-c"],
      expected: "[1,2,3,4,5]",
    },
    {
      label: "1グループ",
      stdin: { matrix: [[7]] },
      args: ["-c"],
      expected: "[7]",
    },
  ],
};

export default grader;
