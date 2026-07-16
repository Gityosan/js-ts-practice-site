import type { CliGraderDef } from "../../grade/types";

// ${var^^} で大文字化できているか確認する。
const grader: CliGraderDef = {
  kind: "cli",
  runtime: "sh",
  cases: [
    {
      label: "hello",
      stdin: "hello\n",
      expected: "HELLO",
    },
    {
      label: "AbC",
      stdin: "AbC\n",
      expected: "ABC",
    },
  ],
};

export default grader;
