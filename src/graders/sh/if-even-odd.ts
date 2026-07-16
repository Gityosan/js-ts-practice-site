import type { CliGraderDef } from "../../grade/types";

// read した数値を if (( )) で判定できているかを確認する。
const grader: CliGraderDef = {
  kind: "cli",
  runtime: "sh",
  cases: [
    {
      label: "4 は偶数",
      stdin: "4\n",
      expected: "even",
    },
    {
      label: "7 は奇数",
      stdin: "7\n",
      expected: "odd",
    },
    {
      label: "0 は偶数",
      stdin: "0\n",
      expected: "even",
    },
  ],
};

export default grader;
