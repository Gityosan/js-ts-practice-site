import type { CliGraderDef } from "../../grade/types";

const grader: CliGraderDef = {
  kind: "cli",
  runtime: "jq",
  cases: [
    {
      label: "2人",
      stdin: {
        users: [
          { name: "Aki", age: 20 },
          { name: "Bo", age: 17 },
        ],
      },
      args: ["-r"],
      expected: "Aki (20)\nBo (17)",
    },
    {
      label: "1人",
      stdin: { users: [{ name: "Q", age: 99 }] },
      args: ["-r"],
      expected: "Q (99)",
    },
  ],
};

export default grader;
