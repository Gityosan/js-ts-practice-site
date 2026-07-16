import type { CliGraderDef } from "../../grade/types";

// here-string(<<<) で変数から read できているか確認する。
const grader: CliGraderDef = {
  kind: "cli",
  runtime: "sh",
  cases: [
    {
      label: "10+20+30",
      stdin: "",
      expected: "60",
    },
  ],
};

export default grader;
