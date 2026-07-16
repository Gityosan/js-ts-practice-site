import type { CliGraderDef } from "../../grade/types";

// 繰り返す回数は自由に変えられるので、正常終了（exit 0）すれば OK とする。
const grader: CliGraderDef = {
  kind: "cli",
  runtime: "sh",
  cases: [
    {
      label: "実行できた（繰り返し出力した）",
      stdin: "",
      expected: "",
      skipValueCheck: true,
    },
  ],
};

export default grader;
