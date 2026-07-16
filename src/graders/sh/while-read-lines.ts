import type { CliGraderDef } from "../../grade/types";

// while read -r line で行数不定の入力を処理できているか確認する。
const grader: CliGraderDef = {
  kind: "cli",
  runtime: "sh",
  cases: [
    {
      label: "3行",
      stdin: "apple\nbanana\ncherry\n",
      expected: "> apple\n> banana\n> cherry",
    },
    {
      label: "1行",
      stdin: "only\n",
      expected: "> only",
    },
  ],
};

export default grader;
