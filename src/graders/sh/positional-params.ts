import type { CliGraderDef } from "../../grade/types";

// $# / "$@" で位置パラメータの個数と中身を扱えているか確認する。
const grader: CliGraderDef = {
  kind: "cli",
  runtime: "sh",
  cases: [
    {
      label: "3個の引数",
      stdin: "",
      args: ["_", "apple", "banana", "cherry"],
      expected: "count: 3\napple\nbanana\ncherry",
    },
    {
      label: "1個の引数",
      stdin: "",
      args: ["_", "solo"],
      expected: "count: 1\nsolo",
    },
  ],
};

export default grader;
