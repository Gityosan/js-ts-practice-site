import type { CliGraderDef } from "../../grade/types";

// to_entries + 文字列補間で key=value 形式を作れているか確認する。
const grader: CliGraderDef = {
  kind: "cli",
  runtime: "jq",
  cases: [
    {
      label: "a,b",
      stdin: {
        a: 1,
        b: 2,
      },
      args: ["-r"],
      expected: "a=1\nb=2",
    },
    {
      label: "x",
      stdin: {
        x: 9,
      },
      args: ["-r"],
      expected: "x=9",
    },
  ],
};

export default grader;
