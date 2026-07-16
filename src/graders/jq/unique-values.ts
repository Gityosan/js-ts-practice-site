import type { CliGraderDef } from "../../grade/types";

// unique が重複除去とソートを同時に行うことを理解できているか確認する。
const grader: CliGraderDef = {
  kind: "cli",
  runtime: "jq",
  cases: [
    {
      label: "重複あり",
      stdin: {
        nums: [3, 1, 2, 3, 1, 4],
      },
      args: ["-c"],
      expected: "[1,2,3,4]",
    },
    {
      label: "重複なし",
      stdin: {
        nums: [5, 2, 9],
      },
      args: ["-c"],
      expected: "[2,5,9]",
    },
  ],
};

export default grader;
