import type { CliGraderDef } from "../../grade/types";

// [.users[].age] | add で配列合計を計算できているか確認する。
const grader: CliGraderDef = {
  kind: "cli",
  runtime: "jq",
  cases: [
    {
      label: "20+30+15",
      stdin: {
        users: [
          {
            age: 20,
          },
          {
            age: 30,
          },
          {
            age: 15,
          },
        ],
      },
      expected: "65",
    },
    {
      label: "1人",
      stdin: {
        users: [
          {
            age: 42,
          },
        ],
      },
      expected: "42",
    },
  ],
};

export default grader;
