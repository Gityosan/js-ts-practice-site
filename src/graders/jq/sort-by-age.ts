import type { CliGraderDef } from "../../grade/types";

// sort_by(.age) で昇順ソートできているか確認する。
const grader: CliGraderDef = {
  kind: "cli",
  runtime: "jq",
  cases: [
    {
      label: "3人",
      stdin: {
        users: [
          {
            name: "Bo",
            age: 30,
          },
          {
            name: "Aki",
            age: 20,
          },
          {
            name: "Cy",
            age: 25,
          },
        ],
      },
      args: ["-r"],
      expected: "Aki\nCy\nBo",
    },
  ],
};

export default grader;
