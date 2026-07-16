import type { CliGraderDef } from "../../grade/types";

// for + if で配列を条件フィルタできているか確認する。
const grader: CliGraderDef = {
  kind: "cli",
  runtime: "sh",
  cases: [
    {
      label: "5より大きい値",
      stdin: "",
      expected: "8\n10\n7",
    },
  ],
};

export default grader;
