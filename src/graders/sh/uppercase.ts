import type { CliGraderDef } from "../../grade/types";

const grader: CliGraderDef = {
  kind: "cli",
  runtime: "sh",
  cases: [
    {
      label: "hello を大文字に",
      stdin: "",
      expected: "HELLO",
    },
  ],
};

export default grader;
