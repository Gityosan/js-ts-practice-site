import type { CliGraderDef } from "../../grade/types";

const grader: CliGraderDef = {
  kind: "cli",
  runtime: "jq",
  cases: [
    {
      label: "重複あり",
      stdin: { tags: ["b", "a", "c", "a", "b"] },
      args: ["-r"],
      expected: "a\nb\nc",
    },
    {
      label: "1個",
      stdin: { tags: ["x"] },
      args: ["-r"],
      expected: "x",
    },
  ],
};

export default grader;
