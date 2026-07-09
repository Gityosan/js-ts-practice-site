import type { CliGraderDef } from "../../grade/types";

const grader: CliGraderDef = {
  kind: "cli",
  runtime: "jq",
  cases: [
    {
      label: "混在",
      stdin: {
        users: [{ name: "Aki", nick: "A" }, { name: "Bo" }],
      },
      args: ["-c"],
      expected: '["A","Bo"]',
    },
    {
      label: "nickなし",
      stdin: { users: [{ name: "C" }] },
      args: ["-c"],
      expected: '["C"]',
    },
  ],
};

export default grader;
