import type { CliGraderDef } from "../../grade/types";

// 配列の全要素を for でまわして合計できているか確認する。
const grader: CliGraderDef = {
  kind: "cli",
  runtime: "sh",
  cases: [
    {
      label: "合計31",
      stdin: "",
      expected: "31",
    },
  ],
};

export default grader;
