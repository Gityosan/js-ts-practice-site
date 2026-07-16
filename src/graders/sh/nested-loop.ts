import type { CliGraderDef } from "../../grade/types";

// for のネストで九九（3x3分）を正しく出力できているか確認する。
const grader: CliGraderDef = {
  kind: "cli",
  runtime: "sh",
  cases: [
    {
      label: "3x3",
      stdin: "",
      expected:
        "1 x 1 = 1\n1 x 2 = 2\n1 x 3 = 3\n2 x 1 = 2\n2 x 2 = 4\n2 x 3 = 6\n3 x 1 = 3\n3 x 2 = 6\n3 x 3 = 9",
    },
  ],
};

export default grader;
