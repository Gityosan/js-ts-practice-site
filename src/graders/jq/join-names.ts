import type { CliGraderDef } from "../../grade/types";

const grader: CliGraderDef = {
  kind: "cli",
  runtime: "jq",
  cases: [
    {
      label: "2人",
      stdin: { users: [{ name: "Aki" }, { name: "Bo" }] },
      args: ["-r"],
      expected: "Aki, Bo",
    },
    {
      label: "空",
      stdin: { users: [] },
      args: ["-r"],
      expected: "",
    },
  ],
};

export default grader;
