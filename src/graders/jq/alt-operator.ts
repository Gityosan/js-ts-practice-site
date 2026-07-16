import type { CliGraderDef } from "../../grade/types";

// // 演算子で null 時のデフォルト値を扱えているか確認する。
const grader: CliGraderDef = {
  kind: "cli",
  runtime: "jq",
  cases: [
    {
      label: "nicknameなし",
      stdin: {
        name: "Aki",
      },
      args: ["-r"],
      expected: "no-name",
    },
    {
      label: "nicknameあり",
      stdin: {
        name: "Bo",
        nickname: "B",
      },
      args: ["-r"],
      expected: "B",
    },
  ],
};

export default grader;
