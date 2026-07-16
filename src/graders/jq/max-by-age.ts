import type { CliGraderDef } from "../../grade/types";

// max_by(.age) で最大要素を取得できているか確認する。
const grader: CliGraderDef = {
  kind: "cli",
  runtime: "jq",
  cases: [
    {
      label: "3人中Boが最年長",
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
      expected: "Bo",
    },
  ],
};

export default grader;
