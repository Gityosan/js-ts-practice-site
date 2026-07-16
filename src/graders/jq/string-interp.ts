import type { CliGraderDef } from "../../grade/types";

// 文字列補間 \(式) で複数フィールドを組み込めているか確認する。
const grader: CliGraderDef = {
  kind: "cli",
  runtime: "jq",
  cases: [
    {
      label: "Aki 20",
      stdin: {
        name: "Aki",
        age: 20,
      },
      args: ["-r"],
      expected: "Aki is 20 years old",
    },
    {
      label: "Bo 30",
      stdin: {
        name: "Bo",
        age: 30,
      },
      args: ["-r"],
      expected: "Bo is 30 years old",
    },
  ],
};

export default grader;
