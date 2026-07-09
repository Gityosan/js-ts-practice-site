import type { CliGraderDef } from "../../grade/types";

const grader: CliGraderDef = {
  kind: "cli",
  runtime: "jq",
  cases: [
    {
      label: "大人2人",
      stdin: {
        users: [
          { name: "Aki", age: 20 },
          { name: "Bo", age: 17 },
          { name: "Zoe", age: 42 },
        ],
      },
      args: ["-r"],
      expected: "Aki\nZoe",
    },
    {
      label: "全員未成年",
      stdin: { users: [{ name: "K", age: 10 }] },
      args: ["-r"],
      expected: "",
    },
  ],
};

export default grader;
