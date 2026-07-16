import type { CliGraderDef } from "../../grade/types";

// ${var:0:3} で先頭からの部分文字列を取り出せているか確認する。
const grader: CliGraderDef = {
  kind: "cli",
  runtime: "sh",
  cases: [
    {
      label: "banana",
      stdin: "banana\n",
      expected: "ban",
    },
    {
      label: "ok（2文字）",
      stdin: "ok\n",
      expected: "ok",
    },
  ],
};

export default grader;
