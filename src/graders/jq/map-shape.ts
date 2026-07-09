import type { CliGraderDef } from "../../grade/types";

const grader: CliGraderDef = {
  kind: "cli",
  runtime: "jq",
  cases: [
    {
      label: "3人",
      stdin: {
        users: [
          { name: "Aki", age: 20 },
          { name: "Bo", age: 17 },
          { name: "Zoe", age: 42 },
        ],
      },
      args: ["-c"],
      expected:
        '[{"name":"Aki","adult":true},{"name":"Bo","adult":false},{"name":"Zoe","adult":true}]',
    },
    {
      label: "空",
      stdin: { users: [] },
      args: ["-c"],
      expected: "[]",
    },
  ],
};

export default grader;
