import type { CliGraderDef } from "../../grade/types";

// 部分文字列展開を使って手動で文字列を反転できているか確認する。
const grader: CliGraderDef = {
  kind: "cli",
  runtime: "sh",
  cases: [
    {
      label: "hello",
      stdin: "hello\n",
      expected: "olleh",
    },
    {
      label: "ab",
      stdin: "ab\n",
      expected: "ba",
    },
  ],
};

export default grader;
