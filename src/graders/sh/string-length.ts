import type { CliGraderDef } from "../../grade/types";

// ${#var} で文字数を出力できているか確認する。
const grader: CliGraderDef = {
  kind: "cli",
  runtime: "sh",
  cases: [
    {
      label: "banana",
      stdin: "banana\n",
      expected: "6",
    },
    {
      label: "a",
      stdin: "a\n",
      expected: "1",
    },
  ],
};

export default grader;
