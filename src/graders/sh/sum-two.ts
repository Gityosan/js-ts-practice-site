import type { CliGraderDef } from "../../grade/types";

// read a b で読んだ 2 値の和を出力できているか確認する。
const grader: CliGraderDef = {
  kind: "cli",
  runtime: "sh",
  cases: [
    {
      label: "3 + 5",
      stdin: "3 5\n",
      expected: "8",
    },
    {
      label: "10 + 20",
      stdin: "10 20\n",
      expected: "30",
    },
    {
      label: "0 + 0",
      stdin: "0 0\n",
      expected: "0",
    },
  ],
};

export default grader;
