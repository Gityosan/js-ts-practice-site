import type { CliGraderDef } from "../../grade/types";

const grader: CliGraderDef = {
  kind: "cli",
  runtime: "jq",
  cases: [
    {
      label: "全員成人",
      stdin: { users: [{ age: 20 }, { age: 30 }] },
      expected: "true",
    },
    {
      label: "未成年あり",
      stdin: { users: [{ age: 20 }, { age: 10 }] },
      expected: "false",
    },
  ],
};

export default grader;
