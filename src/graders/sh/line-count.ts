import type { CliGraderDef } from "../../grade/types";

const grader: CliGraderDef = {
  kind: "cli",
  runtime: "sh",
  cases: [
    {
      label: "3行",
      stdin: "apple\nbanana\ncherry\n",
      expected: "3",
    },
  ],
};

export default grader;
