import type { CliGraderDef } from "../../grade/types";

// 配列のインデックス指定でフィールドを取り出せているか確認する。
const grader: CliGraderDef = {
  kind: "cli",
  runtime: "jq",
  cases: [
    {
      label: "Aki, Bo",
      stdin: {
        users: [
          {
            name: "Aki",
          },
          {
            name: "Bo",
          },
        ],
      },
      args: ["-r"],
      expected: "Aki",
    },
    {
      label: "Zoe だけ",
      stdin: {
        users: [
          {
            name: "Zoe",
          },
        ],
      },
      args: ["-r"],
      expected: "Zoe",
    },
  ],
};

export default grader;
