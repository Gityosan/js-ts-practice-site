import type { CliGraderDef } from "../../grade/types";

// has("key") でキーの有無を判定できているか確認する。
const grader: CliGraderDef = {
  kind: "cli",
  runtime: "jq",
  cases: [
    {
      label: "ageあり",
      stdin: {
        name: "Aki",
        age: 20,
      },
      expected: "true",
    },
    {
      label: "ageなし",
      stdin: {
        name: "Aki",
      },
      expected: "false",
    },
  ],
};

export default grader;
