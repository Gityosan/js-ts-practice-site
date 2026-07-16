import type { CliGraderDef } from "../../grade/types";

// keys でオブジェクトのキー一覧（アルファベット順）を取れているか確認する。
const grader: CliGraderDef = {
  kind: "cli",
  runtime: "jq",
  cases: [
    {
      label: "a,b,c",
      stdin: {
        a: 1,
        b: 2,
        c: 3,
      },
      args: ["-c"],
      expected: '["a","b","c"]',
    },
    {
      label: "x,y",
      stdin: {
        y: 1,
        x: 2,
      },
      args: ["-c"],
      expected: '["x","y"]',
    },
  ],
};

export default grader;
