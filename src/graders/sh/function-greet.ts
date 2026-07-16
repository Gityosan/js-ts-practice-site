import type { CliGraderDef } from "../../grade/types";

// 関数定義と $1 の受け渡しができているか確認する。
const grader: CliGraderDef = {
  kind: "cli",
  runtime: "sh",
  cases: [
    {
      label: "3人分の挨拶",
      stdin: "",
      expected: "Hi, Aki!\nHi, Bo!\nHi, Cy!",
    },
  ],
};

export default grader;
