import type { CliGraderDef } from "../../grade/types";

// join(", ") で配列を1本の文字列に結合できているか確認する。
const grader: CliGraderDef = {
  kind: "cli",
  runtime: "jq",
  cases: [
    {
      label: "3色",
      stdin: {
        tags: ["red", "green", "blue"],
      },
      args: ["-r"],
      expected: "red, green, blue",
    },
    {
      label: "1つ",
      stdin: {
        tags: ["solo"],
      },
      args: ["-r"],
      expected: "solo",
    },
  ],
};

export default grader;
