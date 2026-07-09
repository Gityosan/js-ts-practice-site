import type { CliGraderDef } from "../../grade/types";

const grader: CliGraderDef = {
  kind: "cli",
  runtime: "jq",
  cases: [
    {
      label: "3人",
      stdin: {
        users: [{ name: "Aki" }, { name: "Bo" }, { name: "Zoe" }],
      },
      expected: "3",
    },
    {
      label: "空",
      stdin: { users: [] },
      expected: "0",
    },
  ],
};

export default grader;
