import type { CliGraderDef } from "../../grade/types";

const grader: CliGraderDef = {
  kind: "cli",
  runtime: "sh",
  cases: [
    {
      label: "1..4 の偶奇",
      stdin: "",
      expected: "1: odd\n2: even\n3: odd\n4: even",
    },
  ],
};

export default grader;
