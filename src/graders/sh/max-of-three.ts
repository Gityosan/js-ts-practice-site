import type { CliGraderDef } from "../../grade/types";

// 3 値のうち最大値を if/elif/else で選べているか確認する。
const grader: CliGraderDef = {
  kind: "cli",
  runtime: "sh",
  cases: [
    {
      label: "3 9 5",
      stdin: "3 9 5\n",
      expected: "9",
    },
    {
      label: "9 3 5",
      stdin: "9 3 5\n",
      expected: "9",
    },
    {
      label: "3 5 9",
      stdin: "3 5 9\n",
      expected: "9",
    },
  ],
};

export default grader;
