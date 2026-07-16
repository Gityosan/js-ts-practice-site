import type { CliGraderDef } from "../../grade/types";

// case 文で 1〜7 と範囲外(*)を正しく振り分けられているか確認する。
const grader: CliGraderDef = {
  kind: "cli",
  runtime: "sh",
  cases: [
    {
      label: "1 -> Mon",
      stdin: "1\n",
      expected: "Mon",
    },
    {
      label: "5 -> Fri",
      stdin: "5\n",
      expected: "Fri",
    },
    {
      label: "7 -> Sun",
      stdin: "7\n",
      expected: "Sun",
    },
    {
      label: "9 -> invalid",
      stdin: "9\n",
      expected: "invalid",
    },
  ],
};

export default grader;
