import type { CliGraderDef } from "../../grade/types";

// select + and で複数条件のフィルタができているか確認する。
const grader: CliGraderDef = {
  kind: "cli",
  runtime: "jq",
  cases: [
    {
      label: "Akiだけ該当",
      stdin: {
        users: [
          {
            name: "Aki",
            age: 25,
            active: true,
          },
          {
            name: "Bo",
            age: 17,
            active: true,
          },
          {
            name: "Cy",
            age: 30,
            active: false,
          },
        ],
      },
      args: ["-r"],
      expected: "Aki",
    },
  ],
};

export default grader;
