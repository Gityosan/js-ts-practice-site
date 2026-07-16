import type { CliGraderDef } from "../../grade/types";

// group_by + map(length) でグループごとの件数を数えられているか確認する。
const grader: CliGraderDef = {
  kind: "cli",
  runtime: "jq",
  cases: [
    {
      label: "A3人B2人",
      stdin: {
        users: [
          {
            team: "A",
          },
          {
            team: "B",
          },
          {
            team: "A",
          },
          {
            team: "A",
          },
          {
            team: "B",
          },
        ],
      },
      args: ["-c"],
      expected: "[3,2]",
    },
  ],
};

export default grader;
