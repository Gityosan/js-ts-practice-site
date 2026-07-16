import type { CliGraderDef } from "../../grade/types";

// ${var/pat/rep} が最初の1箇所だけを置換することを確認する。
const grader: CliGraderDef = {
  kind: "cli",
  runtime: "sh",
  cases: [
    {
      label: "1箇所",
      stdin: "I have a cat\n",
      expected: "I have a dog",
    },
    {
      label: "2箇所あるが最初だけ",
      stdin: "cat and cat\n",
      expected: "dog and cat",
    },
  ],
};

export default grader;
