import type { CliGraderDef } from "../../grade/types";

// -r（raw 出力）で実行し、名前が 1 行ずつ出ることを本物の jq で確認する。
const grader: CliGraderDef = {
  kind: "cli",
  runtime: "jq",
  cases: [
    {
      label: "2 人",
      stdin: {
        users: [
          { name: "Aki", age: 20 },
          { name: "Bo", age: 30 },
        ],
      },
      args: ["-r"],
      expected: "Aki\nBo",
    },
    {
      label: "1 人",
      stdin: { users: [{ name: "Zoe", age: 42 }] },
      args: ["-r"],
      expected: "Zoe",
    },
    {
      label: "空配列",
      stdin: { users: [] },
      args: ["-r"],
      expected: "",
    },
  ],
};

export default grader;
