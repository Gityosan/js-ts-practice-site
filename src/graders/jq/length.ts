import type { CliGraderDef } from "../../grade/types";

// length で配列の要素数を数えられているか確認する。
const grader: CliGraderDef = {
  kind: "cli",
  runtime: "jq",
  cases: [
    {
      label: "4件",
      stdin: {
        items: [1, 2, 3, 4],
      },
      expected: "4",
    },
    {
      label: "0件",
      stdin: {
        items: [],
      },
      expected: "0",
    },
    {
      label: "6件",
      stdin: {
        items: [1, 2, 3, 4, 5, 6],
      },
      expected: "6",
    },
  ],
};

export default grader;
