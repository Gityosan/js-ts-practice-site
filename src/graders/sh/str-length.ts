import type { CliGraderDef } from "../../grade/types";

const grader: CliGraderDef = {
  kind: "cli",
  runtime: "sh",
  cases: [
    {
      label: "wasm の文字数",
      stdin: "",
      expected: "4",
    },
  ],
};

export default grader;
