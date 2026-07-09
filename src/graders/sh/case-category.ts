import type { CliGraderDef } from "../../grade/types";

const grader: CliGraderDef = {
  kind: "cli",
  runtime: "sh",
  cases: [
    {
      label: "apple/banana/carrot",
      stdin: "",
      expected: "apple: fruit\nbanana: fruit\ncarrot: other",
    },
  ],
};

export default grader;
