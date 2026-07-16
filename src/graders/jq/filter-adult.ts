import type { CliGraderDef } from "../../grade/types";

// select(条件) で配列を絞り込めているか確認する。
const grader: CliGraderDef = {
  kind: "cli",
  runtime: "jq",
  cases: [
    {
      label: "2人該当",
      stdin: {
        users: [
          {
            name: "Aki",
            age: 20,
          },
          {
            name: "Bo",
            age: 15,
          },
          {
            name: "Cy",
            age: 18,
          },
        ],
      },
      args: ["-r"],
      expected: "Aki\nCy",
    },
    {
      label: "誰も該当しない",
      stdin: {
        users: [
          {
            name: "Bo",
            age: 10,
          },
        ],
      },
      args: ["-r"],
      expected: "",
    },
  ],
};

export default grader;
