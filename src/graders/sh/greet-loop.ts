import type { CliGraderDef } from "../../grade/types";

// 本物の bash（@wasmer/sdk）で `bash -c '<script>'` を実行し、標準出力を比較する。
const grader: CliGraderDef = {
  kind: "cli",
  runtime: "sh",
  cases: [
    {
      label: "Hello 1..3",
      stdin: "",
      expected: "Hello 1\nHello 2\nHello 3",
    },
  ],
};

export default grader;
