import type { CliGraderDef } from "../../grade/types";

const grader: CliGraderDef = {
  kind: "cli",
  runtime: "jq",
  cases: [
    {
      label: "3人",
      stdin: {
        users: [
          { name: "Aki", age: 30 },
          { name: "Bo", age: 20 },
          { name: "Zoe", age: 25 },
        ],
      },
      args: ["-r"],
      expected: "Bo\nZoe\nAki",
    },
    {
      label: "1人",
      stdin: { users: [{ name: "X", age: 5 }] },
      args: ["-r"],
      expected: "X",
    },
  ],
};

export default grader;
