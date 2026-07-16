import type { CliGraderDef } from "../../grade/types";

// if/then/else/end で条件分岐できているか、境界値も確認する。
const grader: CliGraderDef = {
  kind: "cli",
  runtime: "jq",
  cases: [
    {
      label: "85点",
      stdin: {
        score: 85,
      },
      args: ["-r"],
      expected: "pass",
    },
    {
      label: "40点",
      stdin: {
        score: 40,
      },
      args: ["-r"],
      expected: "fail",
    },
    {
      label: "境界60点",
      stdin: {
        score: 60,
      },
      args: ["-r"],
      expected: "pass",
    },
  ],
};

export default grader;
