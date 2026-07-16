import type { CliGraderDef } from "../../grade/types";

// map(. * 2) で各要素を加工し .[] で展開できているか確認する。
const grader: CliGraderDef = {
  kind: "cli",
  runtime: "jq",
  cases: [
    {
      label: "1,2,3",
      stdin: {
        nums: [1, 2, 3],
      },
      expected: "2\n4\n6",
    },
    {
      label: "0,5",
      stdin: {
        nums: [0, 5],
      },
      expected: "0\n10",
    },
  ],
};

export default grader;
