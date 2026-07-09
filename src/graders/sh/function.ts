import type { CliGraderDef } from "../../grade/types";

const grader: CliGraderDef = {
  kind: "cli",
  runtime: "sh",
  cases: [
    {
      label: "greet を2回呼ぶ",
      stdin: "",
      expected: "Hi, Aki\nHi, Bo",
    },
  ],
};

export default grader;
