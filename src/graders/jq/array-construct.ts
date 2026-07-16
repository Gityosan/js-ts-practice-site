import type { CliGraderDef } from "../../grade/types";

// {name, age} ショートハンドと map で新しい形の配列を作れているか確認する。
const grader: CliGraderDef = {
  kind: "cli",
  runtime: "jq",
  cases: [
    {
      label: "2人",
      stdin: {
        users: [
          {
            name: "Aki",
            age: 20,
            email: "a@x.com",
          },
          {
            name: "Bo",
            age: 30,
            email: "b@x.com",
          },
        ],
      },
      args: ["-c"],
      expected: '[{"name":"Aki","age":20},{"name":"Bo","age":30}]',
    },
  ],
};

export default grader;
