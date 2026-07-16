import type { CliGraderDef } from "../../grade/types";

// while ループでカウントダウンし、最後に Go! を出力できているか確認する。
const grader: CliGraderDef = {
  kind: "cli",
  runtime: "sh",
  cases: [
    {
      label: "5..1 と Go!",
      stdin: "",
      expected: "5\n4\n3\n2\n1\nGo!",
    },
  ],
};

export default grader;
