import type { CliGraderDef } from "../../grade/types";

// 数字は自由に変えられるので、正常終了（exit 0）すれば OK とする。
const grader: CliGraderDef = {
  kind: "cli",
  runtime: "sh",
  cases: [
    {
      label: "実行できた（計算結果を出力した）",
      stdin: "",
      expected: "",
      skipValueCheck: true,
    },
  ],
};

export default grader;
